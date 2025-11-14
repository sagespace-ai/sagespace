"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import { Settings, User, Flame, CreditCard, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"

interface UserData {
  name: string
  email: string
  image: string | null
  xp: number
  level: number
  streakDays: number
}

export function CommandBarUserSection() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const [userRes, progressRes] = await Promise.all([
        fetch('/api/user/me'),
        fetch('/api/user/progress'),
      ])
      
      if (userRes.ok && progressRes.ok) {
        const user = await userRes.json()
        const progress = await progressRes.json()
        
        // Check if user object exists and has required properties
        if (user && typeof user === 'object') {
          setUserData({
            name: user.name || user.email?.split('@')[0] || 'Anonymous',
            email: user.email || 'no-email@example.com',
            image: user.image || null,
            xp: progress?.xp || 0,
            level: progress?.level || 1,
            streakDays: progress?.streakDays || 0,
          })
        } else {
          // Set default anonymous user if user object is invalid
          setUserData({
            name: 'Anonymous',
            email: 'no-email@example.com',
            image: null,
            xp: 0,
            level: 1,
            streakDays: 0,
          })
        }
      } else {
        // Set default anonymous user if API calls fail
        setUserData({
          name: 'Anonymous',
          email: 'no-email@example.com',
          image: null,
          xp: 0,
          level: 1,
          streakDays: 0,
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Set default anonymous user on error
      setUserData({
        name: 'Anonymous',
        email: 'no-email@example.com',
        image: null,
        xp: 0,
        level: 1,
        streakDays: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    setIsOpen(false)
  }

  if (loading || !userData) {
    return (
      <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
    )
  }

  const initials = userData.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Avatar className="h-8 w-8 border-2 border-purple-500 ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
          {userData.image && <AvatarImage src={userData.image || "/placeholder.svg"} />}
          <AvatarFallback className="bg-purple-900 text-cyan-300 text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Streak indicator */}
        {userData.streakDays > 0 && (
          <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
            <Flame className="h-2.5 w-2.5" fill="currentColor" />
            <span>{userData.streakDays}</span>
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-purple-500/20 bg-black/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="p-3 border-b border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-10 w-10 border-2 border-purple-500">
                  {userData.image && <AvatarImage src={userData.image || "/placeholder.svg"} />}
                  <AvatarFallback className="bg-purple-900 text-cyan-300">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200 truncate">Level {userData.level}</div>
                  <div className="text-xs text-slate-400">{userData.xp.toLocaleString()} XP</div>
                </div>
              </div>
              {userData.streakDays > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-400">
                  <Flame className="h-3 w-3" fill="currentColor" />
                  <span>{userData.streakDays} day streak</span>
                </div>
              )}
            </div>

            {/* Menu items */}
            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-300 hover:bg-purple-500/10"
                onClick={() => {
                  router.push('/profile')
                  setIsOpen(false)
                }}
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-300 hover:bg-purple-500/10"
                onClick={() => {
                  router.push('/subscriptions')
                  setIsOpen(false)
                }}
              >
                <CreditCard className="h-4 w-4" />
                Subscriptions
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-300 hover:bg-purple-500/10"
                onClick={() => {
                  router.push('/settings')
                  setIsOpen(false)
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              
              <div className="my-1 border-t border-purple-500/20" />
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
