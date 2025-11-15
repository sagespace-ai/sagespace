-- SQL Functions for Monetization

-- Increment session revenue
CREATE OR REPLACE FUNCTION increment_session_revenue(
  p_session_id UUID,
  p_amount DECIMAL
)
RETURNS VOID AS $$
BEGIN
  UPDATE live_sessions
  SET total_tips_usd = total_tips_usd + p_amount
  WHERE id = p_session_id;
  
  -- Also update creator total revenue
  UPDATE live_session_creators
  SET total_revenue = total_revenue + (p_amount * 0.85)
  WHERE id = (SELECT creator_id FROM live_sessions WHERE id = p_session_id);
END;
$$ LANGUAGE plpgsql;

-- Complete Sage Card purchase
CREATE OR REPLACE FUNCTION complete_card_purchase(
  p_payment_intent_id TEXT
)
RETURNS VOID AS $$
DECLARE
  v_card_id UUID;
BEGIN
  -- Get card ID from purchase
  SELECT card_id INTO v_card_id
  FROM sage_card_purchases
  WHERE stripe_payment_intent_id = p_payment_intent_id;
  
  -- Increment sold count
  UPDATE sage_cards
  SET sold_count = sold_count + 1
  WHERE id = v_card_id;
  
  -- Update creator revenue
  UPDATE live_session_creators
  SET total_revenue = total_revenue + (
    (SELECT price_paid FROM sage_card_purchases WHERE stripe_payment_intent_id = p_payment_intent_id) * 0.80
  )
  WHERE id = (SELECT creator_id FROM sage_cards WHERE id = v_card_id);
END;
$$ LANGUAGE plpgsql;

-- Get creator revenue summary
CREATE OR REPLACE FUNCTION get_creator_revenue_summary(
  p_creator_id UUID
)
RETURNS TABLE (
  total_tips DECIMAL,
  total_sage_cards DECIMAL,
  total_priority_questions DECIMAL,
  available_balance DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(creator_earnings), 0) as total_tips,
    COALESCE((
      SELECT SUM(price_paid * 0.80)
      FROM sage_card_purchases scp
      JOIN sage_cards sc ON scp.card_id = sc.id
      WHERE sc.creator_id = p_creator_id
    ), 0) as total_sage_cards,
    COALESCE((
      SELECT COUNT(*) * 2.99 * 0.85
      FROM live_session_messages lsm
      JOIN live_sessions ls ON lsm.session_id = ls.id
      WHERE ls.creator_id = p_creator_id
      AND lsm.message_type = 'question'
      AND lsm.is_highlighted = true
    ), 0) as total_priority_questions,
    (SELECT total_revenue FROM live_session_creators WHERE id = p_creator_id) as available_balance
  FROM live_session_tips lst
  JOIN live_sessions ls ON lst.session_id = ls.id
  WHERE ls.creator_id = p_creator_id
  AND lst.payment_status = 'completed';
END;
$$ LANGUAGE plpgsql;
