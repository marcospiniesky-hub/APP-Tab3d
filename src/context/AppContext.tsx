import { createContext, useContext, useState, ReactNode } from 'react'

type Screen = 'home' | 'lesson' | 'games' | 'ar' | 'profile' | 'quiz' | 'memory' | 'puzzle' | 'model'

interface AppState {
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void
  xp: number
  addXP: (amount: number) => void
  level: number
  streak: number
  completedLessons: string[]
  completeLesson: (id: string) => void
  achievements: string[]
  unlockAchievement: (id: string) => void
  coins: number
  addCoins: (amount: number) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [xp, setXP] = useState(350)
  const [level, setLevel] = useState(3)
  const [streak, setStreak] = useState(5)
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-1'])
  const [achievements, setAchievements] = useState<string[]>(['first-login', 'quiz-master'])
  const [coins, setCoins] = useState(120)

  const addXP = (amount: number) => {
    setXP(prev => {
      const newXP = prev + amount
      if (newXP >= level * 200) {
        setLevel(l => l + 1)
        return 0
      }
      return newXP
    })
  }

  const completeLesson = (id: string) => {
    setCompletedLessons(prev => [...new Set([...prev, id])])
    addXP(50)
    addCoins(10)
  }

  const unlockAchievement = (id: string) => {
    setAchievements(prev => [...new Set([...prev, id])])
    addXP(100)
    addCoins(25)
  }

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount)
  }

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      xp, addXP, level, streak,
      completedLessons, completeLesson,
      achievements, unlockAchievement,
      coins, addCoins
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
