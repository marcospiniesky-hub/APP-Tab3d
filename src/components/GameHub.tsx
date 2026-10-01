import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function GameHub() {
  const { setCurrentScreen, coins } = useApp()

  const games = [
    {
      id: 'quiz',
      title: 'Quiz do Conhecimento',
      description: 'Teste seus conhecimentos com perguntas de múltipla escolha',
      icon: '🧠',
      color: 'from-amber-500 to-orange-500',
      reward: '30 XP + 10 moedas',
      screen: 'quiz' as const,
    },
    {
      id: 'memory',
      title: 'Jogo da Memória',
      description: 'Encontre os pares de cartas com temas científicos',
      icon: '🃏',
      color: 'from-purple-500 to-pink-500',
      reward: '25 XP + 8 moedas',
      screen: 'memory' as const,
    },
    {
      id: 'puzzle',
      title: 'Quebra-Cabeça Molecular',
      description: 'Monte moléculas e estruturas científicas',
      icon: '🧩',
      color: 'from-green-500 to-teal-500',
      reward: '40 XP + 15 moedas',
      screen: 'puzzle' as const,
    },
  ]

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2">🎮 Central de Jogos</h2>
      <p className="text-slate-400 mb-6">Aprenda brincando! Ganhe XP e moedas</p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-4 mb-6"
      >
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-300">3</p>
            <p className="text-xs text-slate-400">Jogos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-300">∞</p>
            <p className="text-xs text-slate-400">Diversão</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-300">{coins}</p>
            <p className="text-xs text-slate-400">Moedas</p>
          </div>
        </div>
      </motion.div>

      {/* Games List */}
      <div className="space-y-4">
        {games.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentScreen(game.screen)}
            className="w-full text-left"
          >
            <div className={`bg-gradient-to-br ${game.color} rounded-2xl p-5 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <span className="text-4xl mb-3 block">{game.icon}</span>
                <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                <p className="text-white/80 text-sm mb-3">{game.description}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    🎁 {game.reward}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Leaderboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700"
      >
        <h3 className="font-bold text-white mb-3">🏆 Ranking da Semana</h3>
        <div className="space-y-2">
          {[
            { name: 'Você', score: 350, position: 1 },
            { name: 'Maria S.', score: 320, position: 2 },
            { name: 'João P.', score: 280, position: 3 },
          ].map((player) => (
            <div key={player.position} className="flex items-center gap-3">
              <span className="text-lg w-6">
                {player.position === 1 ? '🥇' : player.position === 2 ? '🥈' : '🥉'}
              </span>
              <span className={`flex-1 ${player.position === 1 ? 'text-yellow-300 font-bold' : 'text-slate-300'}`}>
                {player.name}
              </span>
              <span className="text-indigo-300 font-bold">{player.score} XP</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
