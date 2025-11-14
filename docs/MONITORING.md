# SageSpace Monitoring & Observability

## Overview

SageSpace includes comprehensive monitoring, fail-safes, and load protection to ensure:
- Zero-cost operation via Groq-first routing
- Graceful degradation instead of crashes
- No "oops" moments (blank screens, 500s, stuck chats)
- Full observability for production diagnostics

## Health Check Endpoints

### `/api/health`
Overall app status including database, auth, and router connectivity.

**Example Response:**
\`\`\`json
{
  "timestamp": "2025-01-14T12:00:00Z",
  "status": "healthy",
  "checks": {
    "database": { "ok": true, "latencyMs": 45 },
    "auth": { "ok": true },
    "router": { "ok": true }
  }
}
\`\`\`

### `/api/ai/health`
Tests Groq-first router with a trivial prompt. Never hits premium providers.

**Example Response:**
\`\`\`json
{
  "ok": true,
  "provider": "groq",
  "latencyMs": 234,
  "charterAligned": true,
  "estimatedCost": 0
}
\`\`\`

### `/api/db/health`
Verifies Supabase connection with a fast read operation.

### `/api/system/status`
Returns current load status, circuit breaker states, active limits, and performance metrics.

**Example Response:**
\`\`\`json
{
  "status": "normal",
  "load": {
    "aiLatencyHigh": false,
    "errorRateHigh": false
  },
  "limits": {
    "councilParticipants": 5,
    "maxResponseLength": 2000,
    "memorySummarizationEnabled": true
  },
  "circuitBreakers": {
    "groq": "closed",
    "gateway": "closed",
    "supabase": "closed"
  },
  "metrics": { ... }
}
\`\`\`

## Circuit Breaker System

Circuit breakers prevent cascade failures by temporarily disabling failing providers:

- **Closed**: Normal operation, all requests pass through
- **Open**: Provider is failing, requests are blocked or routed to fallback
- **Half-Open**: Testing if provider has recovered

**Configuration:**
- Failure threshold: 5 errors in 1 minute
- Cooldown period: 60 seconds
- Success threshold to close: 2 consecutive successes

## Load-Aware Degradation

When AI latency or error rates are high, the system automatically:

1. **Light Mode** (High latency):
   - Reduces Council participants from 5 → 4
   - Reduces max response length from 2000 → 1500 tokens

2. **Degraded Mode** (High errors):
   - Reduces Council participants from 5 → 3
   - Reduces max response length from 2000 → 1000 tokens
   - Disables memory summarization

Users see subtle banners: "Running in light mode while the cosmos stabilizes."

## SLO Definitions

**Service Level Objectives:**
- P95 Playground chat latency: < 3s
- P95 Council response latency: < 7s
- Error rate: < 1% for main flows

Violations are logged with `slo_violation: true` for alerting.

## Structured Logging

All logs include:
- `correlationId`: Request tracking across services
- `route`: API endpoint
- `userId`: If authenticated
- `provider`: groq | gateway | hf
- `model`: Model ID
- `latencyMs`: Response time
- `tokenEstimate`: Approximate tokens used
- `errorCode` / `errorMessage`: For failures

## Metrics Collection

In-memory metrics track:
- Requests per route
- AI calls per provider
- Latency histograms (P50, P95, P99)
- Error rate per route
- Council failures vs successes

## Behavior Under Failure Scenarios

### Groq Outage
1. Circuit breaker opens after 5 failures
2. Router falls back to Vercel AI Gateway (if user tier allows)
3. Users see "temporarily unavailable" for free tier
4. Circuit probes Groq periodically to detect recovery

### Slow Responses
1. Load monitor detects P95 latency > 5s
2. System enters "light mode"
3. Council participants reduced
4. Response lengths capped
5. Memory summarization continues

### Traffic Surge
1. Rate limiters per user/session activate
2. "Safe limit reached, try again later" messages
3. No crashes or 500 errors
4. Graceful queue behavior

## Frontend Error Boundaries

Every major page has:
- **loading.tsx**: Cosmic loading state
- **error.tsx**: Friendly error card with retry

Global error boundary catches all unhandled errors with:
- "The universe hiccupped" message
- Retry and home buttons
- Error details for debugging

## Observatory Dashboard

The `/observatory` page displays:
- System health status
- Provider status (Groq, Gateway, DB)
- Active circuit breakers
- Current load mode (normal/light/degraded)
- Performance metrics (latency, error rate)
- Active limits (Council participants, response length)

## Alert Hooks (Future)

Functions ready for external integration:
- `notifyOnSloBreach(event)` - Wire to email/Slack/webhook
- Triggered on:
  - Repeated Groq failures
  - Sustained high error rate
  - DB connection issues

## Charter Compliance

All monitoring remains:
- **Groq-first**: Health checks never hit premium providers
- **Zero-cost**: Free tier users always route to Groq
- **Architecturally ready**: Can integrate with Datadog/Prometheus later

## Conclusion

SageSpace is production-ready with robust monitoring, automatic fail-safes, and graceful degradation ensuring users never see crashes or blank screens while maintaining zero-cost operation per the Master Charter.
