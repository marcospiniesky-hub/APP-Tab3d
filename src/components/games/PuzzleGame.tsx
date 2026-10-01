import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import confetti from 'canvas-confetti'

interface PuzzlePiece {
  id: number
  correctIndex: number
  currentIndex: number
  label: string
  color: string
}

const puzzles = [
  {
    title: 'Cadeia Alimentar',
    pieces: [
      { id: 1, label: '☀️ Sol', color: 'from-yellow-400 to-orange-400' },
      { id: 2, label: '🌱 Planta', color: 'from-green-400 to-emerald-400' },
      { id: 3, label: '🐛 Inseto', color: 'from-lime-400 to-green-400' },
      { id: 4, label: '🐦 Pássaro', color: 'from-blue-400 to-cyan-400' },
      { id: 5, label: '🦅 Águia', color: 'from-purple-400 to-indigo-400' },
      { id: 6, label: '🦠 Decompositor', color: 'from-amber-400 to-yellow-400' },
    ],
    hint: 'A energia flui do Sol para os produtores, depois consumidores e decompositores'
  },
  {
    title: 'Camadas da Terra',
    pieces: [
      { id: 1, label: '🌡️ Núcleo Interno', color: 'from-red-500 to-orange-500' },
      { id: 2, label: '🔥 Núcleo Externo', color: 'from-orange-500 to-amber-500' },
      { id: 3, label: '🌋 Manto', color: 'from-amber-500 to-yellow-500' },
      { id: 4, label: '🪨 Crosta', color: 'from-stone-400 to-stone-500' },
      { id: 5, label: '💧 Oceanos', color: 'from-blue-400 to-blue-600' },
      { id: 6, label: '💨 Atmosfera', color: 'from-sky-300 to-blue-300' },
    ],
    hint: 'Organize do centro (mais quente) para fora (mais frio)'
  },
  {
    title: 'Sistema Solar',
    pieces: [
      { id: 1, label: '☀️ Sol', color: 'from-yellow-400 to-amber-400' },
      { id: 2, label: '🪨 Mercúrio', color: 'from-gray-400 to-gray-500' },
      { id: 3, label: '🌍 Vênus', color: 'from-orange-300 to-amber-300' },
      { id: 4, label: '🌎 Terra', color: 'from-blue-400 to-green-400' },
      { id: 5, label: '🔴 Marte', color: 'from-red-400 to-red-500' },
      { id: 6, label: '🟤 Júpiter', color: 'from-amber-600 to-orange-600' },
    ],
    hint: 'Ordene do Sol para fora, pelos planetas mais próximos'
  }
]

export default function PuzzleGame() {
  const { setCurrentScreen, addXP, addCoins } = useApp()
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [moves, setMoves] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    initPuzzle()
  }, [currentPuzzle])

  const initPuzzle = () => {
    const puzzle = puzzles[currentPuzzle]
    const shuffled = [...puzzle.pieces].sort(() => Math.random() - 0.5)
    setPieces(shuffled.map((p, i) => ({
      ...p,
      correctIndex: puzzle.pieces.findIndex(pp => pp.id === p.id),
      currentIndex: i,
    })))
    setIsComplete(false)
    setMoves(0)
    setShowHint(false)
  }

  const handleSwap = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setMoves(m => m + 1)
    setPieces(prev => {
      const newPieces = [...prev]
      const temp = newPieces[fromIndex]
      newPieces[fromIndex] = { ...newPieces[toIndex], currentIndex: fromIndex }
      newPieces[toIndex] = { ...temp, currentIndex: toIndex }
      
      // Check if complete
      const isSolved = newPieces.every(p => p.currentIndex === p.correctIndex)
      if (isSolved) {
        setIsComplete(true)
        addXP(40)
        addCoins(15)
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } })
      }
      
      return newPieces
    })
    setDraggedPiece(null)
  }

  const puzzle = puzzles[currentPuzzle]

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
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">🎯 {moves} movimentos</span>
        </div>
      </div>

      {/* Puzzle Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl font-bold text-white mb-1">🧩 {puzzle.title}</h2>
        <p className="text-slate-400 text-sm">Organize na ordem correta</p>
      </motion.div>

      {/* Puzzle Board */}
      <div className="space-y-2 mb-6">
        {pieces.map((piece, index) => (
          <motion.button
            key={piece.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (draggedPiece === null) {
                setDraggedPiece(index)
              } else {
                handleSwap(draggedPiece, index)
              }
            }}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
              draggedPiece === index
                ? 'border-indigo-400 bg-indigo-500/20 scale-[0.98]'
                : piece.currentIndex === piece.correctIndex && isComplete
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
              {index + 1}
            </span>
            <div className={`flex-1 bg-gradient-to-r ${piece.color} rounded-lg p-2`}>
              <span className="font-bold text-white text-sm">{piece.label}</span>
            </div>
            {piece.currentIndex === piece.correctIndex && isComplete && (
              <span className="text-green-400">✅</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700">
        <p className="text-slate-400 text-sm text-center">
          {draggedPiece === null
            ? '👆 Toque em uma peça para selecionar, depois toque em outra para trocar'
            : '👆 Agora toque na peça de destino para trocar'}
        </p>
      </div>

      {/* Hint */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHint(!showHint)}
        className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold py-3 rounded-xl mb-3"
      >
        💡 {showHint ? 'Esconder Dica' : 'Ver Dica'}
      </motion.button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4"
          >
            <p className="text-amber-300 text-sm">{puzzle.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle Selector */}
      <div className="flex gap-2 mb-4">
        {puzzles.map((p, i) => (
          <button
            key={i}
            onClick={() => setCurrentPuzzle(i)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold ${
              i === currentPuzzle
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {p.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Reset */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={initPuzzle}
        className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl"
      >
        🔄 Embaralhar Novamente
      </motion.button>

      {/* Win Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm w-full border border-green-500/30"
            >
              <span className="text-6xl block mb-4">🎊</span>
              <h2 className="text-2xl font-bold mb-2">Quebra-cabeça Completo!</h2>
              <p className="text-slate-400 mb-4">
                Você organizou "{puzzle.title}" em {moves} movimentos!
              </p>
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-green-400 font-bold">+40 XP</span>
                <span className="text-yellow-400 font-bold">+15 🪙</span>
              </div>
              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentPuzzle < puzzles.length - 1) {
                      setCurrentPuzzle(p => p + 1)
                    } else {
                      setCurrentPuzzle(0)
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-xl"
                >
                  {currentPuzzle < puzzles.length - 1 ? '➡️ Próximo Puzzle' : '🔄 Recomeçar'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentScreen('games')}
                  className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl"
                >
                  🎮 Outros Jogos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
