import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, language: 'vi' | 'en' = 'vi') {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'PPP', { locale: language === 'vi' ? vi : enUS })
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0 
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}

export function calculateLevel(xp: number) {
  return Math.floor(xp / 500) + 1
}

export function getXPProgress(xp: number) {
  const level = calculateLevel(xp)
  const currentLevelXP = (level - 1) * 500
  const nextLevelXP = level * 500
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  return Math.min(Math.max(progress, 0), 100)
}
