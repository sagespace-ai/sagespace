"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PERSONALITY_QUESTIONS, calculatePersonality } from '@/lib/utils/genesis-helpers'

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const currentQuestion = PERSONALITY_QUESTIONS[step]
  const isLastQuestion = step === PERSONALITY_QUESTIONS.length - 1

  async function handleNext() {
    if (!selectedOption) return

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption }
    setAnswers(newAnswers)

    if (isLastQuestion) {
      setSubmitting(true)
      try {
        const personality = calculatePersonality(newAnswers)
        
        console.log('[v0] Submitting onboarding completion...')
        const response = await fetch('/api/genesis/complete-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalityType: personality.type,
            affinities: personality.affinities,
            answers: newAnswers,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to complete onboarding')
        }

        const data = await response.json()
        console.log('[v0] Onboarding response:', data)
        
        // Store onboarding data in localStorage until proper database tables exist
        if (typeof window !== 'undefined') {
          localStorage.setItem('genesis_onboarding', JSON.stringify({
            completed: true,
            personalityType: personality.type,
            affinities: personality.affinities,
            answers: newAnswers,
            completedAt: new Date().toISOString()
          }))
        }

        // NOW call onComplete after successful API call and localStorage save
        onComplete()
      } catch (error) {
        console.error('[v0] Error completing onboarding:', error)
        alert('Failed to complete onboarding. Please try again.')
      } finally {
        setSubmitting(false)
      }
    } else {
      setStep(step + 1)
      setSelectedOption('')
    }
  }

  if (step === 0 && Object.keys(answers).length === 0) {
    // Welcome screen
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center"
        >
          {/* Animated cosmic background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <Sparkles className="w-32 h-32 text-purple-400" />
          </motion.div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Welcome to Genesis Chamber
          </h1>
          
          <p className="text-xl text-slate-300 mb-4">
            Your cosmic identity awaits
          </p>
          
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            I'm Origin Sage, your free companion through the universe of wisdom. 
            Let me help you discover your unique path and unlock the sages that resonate with your journey.
          </p>

          <Card className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-purple-500/30 backdrop-blur mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 text-left">
                <div className="text-4xl">✨</div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Your Free Companion</h3>
                  <p className="text-sm text-slate-300">
                    Origin Sage is yours forever. Together, we'll build your profile, unlock your potential, 
                    and discover which premium sages from our universe of 300+ specialists can accelerate your growth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            onClick={() => setStep(1)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold text-lg px-8 py-6"
          >
            Begin Your Awakening
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Question {step} of {PERSONALITY_QUESTIONS.length}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round((step / PERSONALITY_QUESTIONS.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-purple-500/30">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / PERSONALITY_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/50 border-purple-500/30 backdrop-blur-xl mb-6">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedOption === option.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-purple-500/20 bg-black/20 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{option.label}</span>
                      {selectedOption === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-slate-400"
            >
              Previous
            </Button>

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!selectedOption || submitting}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {submitting ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Awakening...
                </>
              ) : isLastQuestion ? (
                <>
                  Complete Awakening
                  <Sparkles className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
