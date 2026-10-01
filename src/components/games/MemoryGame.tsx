import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import confetti from 'canvas-confetti'

const cardPairs = [
  { id: 1, emoji: '⚛️', match: 'Átomo' },
  { id: 2, emoji: '🧬', match: 'DNA' },
  { id: 3, emoji: '🪐', match: 'Planeta' },
  { id: 4, emoji: '🔬', match: 'Célula' },
  { id: 5, emoji: '⚡', match: 'Energia' },
  { id: 6, emoji: '🌍', match: 'Terra' },
  { id: 7, emoji: '🧪', match: 'Química' },
  { id: 8, emoji: '🚀', match: 'Foguete' },
]

interface Card {
  id: number
  pairId: number
  content: string
  type: 'emoji' | 'text'
  flipped: boolean
  matched: boolean
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function MemoryGame() {
  const { setCurrentScreen, addXP, addCoins } = useApp()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    initGame()
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning && !gameWon) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, gameWon])

  const initGame = () => {
    const newCards: Card[] = []
    cardPairs.forEach((pair) => {
      newCards.push({ id: pair.id * 2 - 1, pairId: pair.id, content: pair.emoji, type: 'emoji', flipped: false, matched: false })
      newCards.push({ id: pair.id * 2, pairId: pair.id, content: pair.match, type: 'text', flipped: false, matched: false })
    })
    setCards(shuffleArray(newCards))
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
    setTimer(0)
    setIsRunning(true)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return
    const card = cards.find(c => c.id === cardId)
    if (!card || card.flipped || card.matched) return

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, flipped: true } : c
    )
    setCards(newCards)
    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      const card1 = newCards.find(c => c.id === first)!
      const card2 = newCards.find(c => c.id === second)!

      if (card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === card1.pairId ? { ...c, matched: true } : c
          ))
          setMatches(m => {
            const newMatches = m + 1
            if (newMatches === cardPairs.length) {
              setGameWon(true)
              setIsRunning(false)
              addXP(25)
              addCoins(8)
              confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } })
            }
            return newMatches
          })
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pb-8 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('games')}
          className="text-indigo-400 text-sm"
        >
          ← Sair
        </button>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">⏱️ {formatTime(timer)}</span>
          <span className="text-slate-400 text-sm">🎯 {moves} jogadas</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-300">Pares: {matches}/{cardPairs.length}</span>
        <div className="flex gap-1">
          {cardPairs.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < matches ? 'bg-green-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            layout
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl flex items-center justify-center text-center p-1 transition-all ${
              card.matched
                ? 'bg-green-500/20 border-2 border-green-500/50'
                : card.flipped
                ? 'bg-indigo-500/20 border-2 border-indigo-500/50'
                : 'bg-slate-800/80 border-2 border-slate-700 hover:border-indigo-500/30'
            }`}
            whileTap={{ scale: 0.95 }}
            animate={card.matched ? { scale: [1, 1.1, 1] } : {}}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span
                  key="content"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  className={card.type === 'emoji' ? 'text-2xl' : 'text-xs font-bold text-indigo-300'}
                >
                  {card.content}
                </motion.span>
              ) : (
                <motion.span
                  key="hidden"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  className="text-xl"
                >
                  ❓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Reset Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={initGame}
        className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl mb-4"
      >
        🔄 Reiniciar Jogo
      </motion.button>

      {/* Win Screen */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm w-full border border-indigo-500/30">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-6xl block mb-4"
              >
                🎉
              </motion.span>
              <h2 className="text-2xl font-bold mb-2">Parabéns!</h2>
              <p className="text-slate-400 mb-4">
                Você encontrou todos os pares em {moves} jogadas e {formatTime(timer)}!
              </p>
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-green-400 font-bold">+25 XP</span>
                <span className="text-yellow-400 font-bold">+8 🪙</span>
              </div>
              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={initGame}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 rounded-xl"
                >
                  🔄 Jogar Novamente
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentScreen('games')}
                  className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl"
                >
                  🎮 Outros Jogos
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
