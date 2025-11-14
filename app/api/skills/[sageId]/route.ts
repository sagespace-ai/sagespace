import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SKILL_TREE_TEMPLATES } from '@/lib/gamification/skill-tree'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sageId: string }> }
) {
  try {
    const { sageId } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get template skills for this sage
    const templateSkills = SKILL_TREE_TEMPLATES[sageId] || []

    // Get user's progress for these skills
    const { data: userSkills } = await supabase
      .from('user_sage_skills')
      .select('*')
      .eq('user_id', user.id)
      .eq('sage_id', sageId)

    // Merge template with user progress
    const skills = templateSkills.map(template => {
      const userProgress = userSkills?.find(us => us.skill_id === template.id)
      return {
        ...template,
        level: userProgress?.current_level || 0,
        unlocked: userProgress ? true : template.unlocked
      }
    })

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('[v0] Error fetching skill tree:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}
