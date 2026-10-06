import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import Scene3D from './Scene3D'

export default function HomeScreen() {
  const { xp, level, streak, coins, setCurrentScreen, completedLessons } = useApp()
  const xpNeeded = level * 200
  const xpPercent = (xp / xpNeeded) * 100

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            EduVerse 3D
          </h1>
          <p className="text-slate-400 text-sm">Aprendizado Imersivo</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 flex items-center gap-1"
          >
            <span className="text-orange-400">🔥</span>
            <span className="text-orange-300 text-sm font-bold">{streak}</span>
          </motion.div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-yellow-400">🪙</span>
            <span className="text-yellow-300 text-sm font-bold">{coins}</span>
          </div>
        </div>
      </motion.div>

      {/* XP Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 mb-6 border border-indigo-500/20"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-indigo-300">Nível {level}</span>
          </div>
          <span className="text-slate-400 text-sm">{xp}/{xpNeeded} XP</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* 3D Scene Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/30 backdrop-blur rounded-2xl p-4 mb-6 border border-purple-500/20 cursor-pointer"
        onClick={() => setCurrentScreen('model')}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-purple-300">🧊 Explorar em 3D</h3>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Interativo</span>
        </div>
        <div className="h-48 rounded-xl overflow-hidden bg-slate-900/50">
          <Scene3D />
        </div>
        <p className="text-slate-400 text-sm mt-2">Toque para explorar modelos 3D com zoom</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('lesson')}
          className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30 rounded-2xl p-4 text-left"
        >
          <span className="text-3xl mb-2 block">📚</span>
          <h3 className="font-bold text-blue-300">Aulas</h3>
          <p className="text-slate-400 text-xs mt-1">{completedLessons.length}/8 completas</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('games')}
          className="bg-gradient-to-br from-green-600/30 to-green-800/30 border border-green-500/30 rounded-2xl p-4 text-left"
        >
          <span className="text-3xl mb-2 block">🎮</span>
          <h3 className="font-bold text-green-300">Jogos</h3>
          <p className="text-slate-400 text-xs mt-1">3 jogos disponíveis</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('ar')}
          className="bg-gradient-to-br from-pink-600/30 to-pink-800/30 border border-pink-500/30 rounded-2xl p-4 text-left"
        >
          <span className="text-3xl mb-2 block">📱</span>
          <h3 className="font-bold text-pink-300">Realidade Aumentada</h3>
          <p className="text-slate-400 text-xs mt-1">Ver em AR</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('quiz')}
          className="bg-gradient-to-br from-amber-600/30 to-amber-800/30 border border-amber-500/30 rounded-2xl p-4 text-left"
        >
          <span className="text-3xl mb-2 block">🧠</span>
          <h3 className="font-bold text-amber-300">Quiz Rápido</h3>
          <p className="text-slate-400 text-xs mt-1">Teste seus conhecimentos</p>
        </motion.button>
      </div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-4"
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-4xl"
          >
            🏆
          </motion.span>
          <div>
            <h3 className="font-bold text-yellow-300">Desafio Diário</h3>
            <p className="text-slate-300 text-sm">Complete 3 lições hoje para ganhar 50 moedas extras!</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= completedLessons.length ? 'bg-yellow-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
