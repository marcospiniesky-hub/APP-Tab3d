import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import confetti from 'canvas-confetti'

const questions = [
  {
    question: 'Qual é o símbolo químico da água?',
    options: ['H₂O', 'CO₂', 'NaCl', 'O₂'],
    correct: 0,
    explanation: 'A água é formada por 2 átomos de hidrogênio e 1 de oxigênio.'
  },
  {
    question: 'Quantos planetas tem o Sistema Solar?',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explanation: 'São 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno.'
  },
  {
    question: 'Qual organela é a "usina de energia" da célula?',
    options: ['Núcleo', 'Ribossomo', 'Mitocôndria', 'Lisossomo'],
    correct: 2,
    explanation: 'A mitocôndria produz ATP, a moeda energética da célula.'
  },
  {
    question: 'Qual é a velocidade da luz?',
    options: ['150.000 km/s', '300.000 km/s', '500.000 km/s', '1.000.000 km/s'],
    correct: 1,
    explanation: 'A luz viaja a aproximadamente 300.000 km/s no vácuo.'
  },
  {
    question: 'Quem criou a tabela periódica?',
    options: ['Einstein', 'Newton', 'Mendeleev', 'Darwin'],
    correct: 2,
    explanation: 'Dmitri Mendeleev organizou a tabela periódica em 1869.'
  },
  {
    question: 'Qual é o maior planeta do Sistema Solar?',
    options: ['Saturno', 'Terra', 'Netuno', 'Júpiter'],
    correct: 3,
    explanation: 'Júpiter é tão grande que caberiam 1.300 Terras dentro dele!'
  },
  {
    question: 'O que é DNA?',
    options: ['Uma proteína', 'Um ácido nucleico', 'Um lipídio', 'Um carboidrato'],
    correct: 1,
    explanation: 'O DNA (ácido desoxirribonucleico) carrega as informações genéticas.'
  },
  {
    question: 'Qual a fórmula da Lei de Ohm?',
    options: ['V = R × I', 'F = m × a', 'E = m × c²', 'P = V × I'],
    correct: 0,
    explanation: 'V (tensão) = R (resistência) × I (corrente).'
  },
  {
    question: 'Quanto da Terra é coberto por oceanos?',
    options: ['51%', '61%', '71%', '81%'],
    correct: 2,
    explanation: 'Os oceanos cobrem aproximadamente 71% da superfície terrestre.'
  },
  {
    question: 'Qual partícula tem carga negativa?',
    options: ['Próton', 'Nêutron', 'Elétron', 'Fóton'],
    correct: 2,
    explanation: 'O elétron orbita o núcleo e possui carga elétrica negativa.'
  },
]

export default function QuizGame() {
  const { setCurrentScreen, addXP, addCoins } = useApp()
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)

  const question = questions[currentQ]

  const handleAnswer = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    setShowResult(true)

    if (index === question.correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a78bfa', '#f472b6']
      })
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setGameOver(true)
      const finalScore = score
      addXP(finalScore * 10)
      addCoins(finalScore * 3)
      if (finalScore >= 8) {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 }
        })
      }
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  if (gameOver) {
    const percentage = (score / questions.length) * 100
    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-12"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl block mb-4"
          >
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪'}
          </motion.span>
          <h2 className="text-3xl font-bold mb-2">
            {percentage >= 80 ? 'Incrível!' : percentage >= 50 ? 'Bom trabalho!' : 'Continue tentando!'}
          </h2>
          <p className="text-slate-400 mb-6">
            Você acertou {score} de {questions.length} perguntas
          </p>

          <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-indigo-500/20">
            <div className="text-5xl font-bold text-indigo-300 mb-2">{percentage}%</div>
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-green-400">+{score * 10} XP</span>
              <span className="text-yellow-400">+{score * 3} 🪙</span>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentQ(0)
                setScore(0)
                setSelected(null)
                setShowResult(false)
                setGameOver(false)
                setStreak(0)
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 rounded-2xl"
            >
              🔄 Jogar Novamente
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen('home')}
              className="w-full bg-slate-700 text-white font-bold py-4 rounded-2xl"
            >
              🏠 Voltar ao Início
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pb-8 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentScreen('games')}
          className="text-indigo-400 text-sm"
        >
          ← Sair
        </button>
        <div className="flex items-center gap-3">
          {streak >= 3 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              className="text-orange-400 text-sm font-bold"
            >
              🔥 {streak}x
            </motion.span>
          )}
          <span className="text-slate-400 text-sm">{currentQ + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  showResult
                    ? i === question.correct
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : i === selected
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-slate-800/30 border-slate-700 text-slate-500'
                    : selected === null
                    ? 'bg-slate-800/50 border-slate-600 text-white hover:border-indigo-500/50'
                    : 'bg-slate-800/30 border-slate-700 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showResult && i === question.correct
                      ? 'bg-green-500 text-white'
                      : showResult && i === selected
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {showResult && i === question.correct ? '✓' : showResult && i === selected && i !== question.correct ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4"
              >
                <p className="text-indigo-300 text-sm">
                  💡 {question.explanation}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="w-full mt-3 bg-indigo-500 text-white font-bold py-3 rounded-xl"
                >
                  {currentQ + 1 >= questions.length ? 'Ver Resultado' : 'Próxima →'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
