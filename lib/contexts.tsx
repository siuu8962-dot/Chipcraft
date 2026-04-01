'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTheme as useNextTheme } from 'next-themes'

export type ViewType = 'dashboard' | 'courses' | 'player' | 'tutor' | 'achievements' | 'settings'

interface GlobalContextType {
  // Navigation
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  selectedCourseId?: string
  setSelectedCourseId: (id?: string) => void
  selectedLessonId?: string
  setSelectedLessonId: (id?: string) => void
  
  // Theme & Lang
  isDark: boolean
  toggleTheme: () => void
  language: 'vi' | 'en'
  setLanguage: (lang: 'vi' | 'en') => void
  
  // Mobile UI
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  // Hooks
  const { setTheme, resolvedTheme } = useNextTheme()
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [selectedCourseId, setSelectedCourseId] = useState<string>()
  const [selectedLessonId, setSelectedLessonId] = useState<string>()
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const isDark = resolvedTheme === 'dark'
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const value = {
    currentView,
    setCurrentView,
    selectedCourseId,
    setSelectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    isDark,
    toggleTheme,
    language,
    setLanguage,
    isSidebarOpen,
    setSidebarOpen
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error('useNavigation must be used within GlobalProvider')
  return context
}

export function useTheme() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error('useTheme must be used within GlobalProvider')
  return context
}
