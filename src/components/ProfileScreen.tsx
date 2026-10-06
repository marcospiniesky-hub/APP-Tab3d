import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function ProfileScreen() {
  const { xp, level, streak, coins, completedLessons, achievements, addXP } = useApp()
  const xpNeeded = level * 200

  const allAchievements = [
    { id: 'first-login', name: 'Primeiro Acesso', icon: '🌟', desc: 'Fez login pela primeira vez' },
    { id: 'quiz-master', name: 'Mestre do Quiz', icon: '🧠', desc: 'Acertou 10 perguntas seguidas' },
    { id: 'explorer-3d', name: 'Explorador 3D', icon: '🧊', desc: 'Visualizou 5 modelos 3D' },
    { id: 'ar-pioneer', name: 'Pioneiro AR', icon: '📱', desc: 'Usou realidade aumentada' },
    { id: 'streak-7', name: 'Sequência de 7', icon: '🔥', desc: '7 dias seguidos estudando' },
    { id: 'completionist', name: 'Completista', icon: '🏆', desc: 'Completou todas as aulas' },
    { id: 'speed-demon', name: 'Velocista', icon: '⚡', desc: 'Completou quiz em menos de 30s' },
    { id: 'social', name: 'Social', icon: '👥', desc: 'Compartilhou com um amigo' },
  ]

  const stats = [
    { label: 'XP Total', value: xp + (level - 1) * 200, icon: '⭐' },
    { label: 'Nível', value: level, icon: '📊' },
    { label: 'Sequência', value: `${streak} dias`, icon: '🔥' },
    { label: 'Moedas', value: coins, icon: '🪙' },
    { label: 'Aulas', value: `${completedLessons.length}/8`, icon: '📚' },
    { label: 'Conquistas', value: `${achievements.length}/8`, icon: '🏆' },
  ]

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg shadow-indigo-500/30"
        >
          🎓
        </motion.div>
        <h2 className="text-2xl font-bold">Estudante</h2>
        <p className="text-indigo-400">Nível {level} • Explorador</p>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 mb-6 border border-indigo-500/20"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Progresso para Nível {level + 1}</span>
          <span className="text-indigo-300 text-sm font-bold">{xp}/{xpNeeded} XP</span>
        </div>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(xp / xpNeeded) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 backdrop-blur rounded-xl p-3 border border-slate-700 text-center"
          >
            <span className="text-xl block mb-1">{stat.icon}</span>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold text-white mb-3">🏆 Conquistas</h3>
        <div className="grid grid-cols-2 gap-3">
          {allAchievements.map((achievement, i) => {
            const unlocked = achievements.includes(achievement.id)
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`p-3 rounded-xl border text-center ${
                  unlocked
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-slate-800/30 border-slate-700 opacity-50'
                }`}
              >
                <span className="text-2xl block mb-1">{achievement.icon}</span>
                <p className="text-xs font-bold text-white">{achievement.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{achievement.desc}</p>
                {unlocked && <span className="text-[10px] text-yellow-400 mt-1 block">✅ Desbloqueada</span>}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Daily Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700"
      >
        <h3 className="font-bold text-white mb-3">📈 Atividade Semanal</h3>
        <div className="flex justify-between items-end h-24">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, i) => {
            const height = [60, 80, 45, 90, 70, 30, 50][i]
            return (
              <div key={day} className="flex flex-col items-center gap-1 flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="w-full max-w-[20px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md"
                />
                <span className="text-[10px] text-slate-400">{day}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
