import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomeScreen from './components/HomeScreen'
import LessonViewer from './components/LessonViewer'
import GameHub from './components/GameHub'
import ARView from './components/ARView'
import ProfileScreen from './components/ProfileScreen'
import QuizGame from './components/games/QuizGame'
import MemoryGame from './components/games/MemoryGame'
import PuzzleGame from './components/games/PuzzleGame'
import ModelExplorer from './components/ModelExplorer'
import { AppProvider, useApp } from './context/AppContext'

function AppContent() {
  const { currentScreen, setCurrentScreen } = useApp()

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />
      case 'lesson':
        return <LessonViewer />
      case 'games':
        return <GameHub />
      case 'ar':
        return <ARView />
      case 'profile':
        return <ProfileScreen />
      case 'quiz':
        return <QuizGame />
      case 'memory':
        return <MemoryGame />
      case 'puzzle':
        return <PuzzleGame />
      case 'model':
        return <ModelExplorer />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      
      {currentScreen !== 'quiz' && currentScreen !== 'memory' && currentScreen !== 'puzzle' && (
        <BottomNav />
      )}
    </div>
  )
}

function BottomNav() {
  const { currentScreen, setCurrentScreen } = useApp()
  
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'lesson', icon: '📚', label: 'Aulas' },
    { id: 'model', icon: '🧊', label: '3D' },
    { id: 'games', icon: '🎮', label: 'Jogos' },
    { id: 'ar', icon: '📱', label: 'AR' },
    { id: 'profile', icon: '👤', label: 'Perfil' },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-indigo-500/20 px-2 py-2 z-50"
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentScreen(item.id as any)}
            className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${
              currentScreen === item.id
                ? 'bg-indigo-600/30 text-indigo-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
