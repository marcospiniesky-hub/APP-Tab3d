import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

const lessons = [
  {
    id: 'lesson-1',
    title: 'Átomos e Moléculas',
    icon: '⚛️',
    subject: 'Química',
    color: 'from-blue-500 to-cyan-500',
    content: 'Os átomos são as menores unidades da matéria. Cada átomo é composto por prótons, nêutrons e elétrons.',
    details: 'O núcleo atômico contém prótons (carga positiva) e nêutrons (sem carga). Os elétrons orbitam o núcleo em camadas eletrônicas.',
    facts: ['O átomo de hidrogênio é o mais simples', 'Existem 118 elementos na tabela periódica', 'Átomos são 99.9% espaço vazio']
  },
  {
    id: 'lesson-2',
    title: 'Sistema Solar',
    icon: '🪐',
    subject: 'Astronomia',
    color: 'from-purple-500 to-pink-500',
    content: 'O Sistema Solar é composto pelo Sol e todos os corpos celestes que orbitam ao seu redor.',
    details: 'São 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. O Sol contém 99.86% da massa do sistema.',
    facts: ['Júpiter é o maior planeta', 'Saturno flutuaria na água', 'Vênus gira ao contrário']
  },
  {
    id: 'lesson-3',
    title: 'DNA e Genética',
    icon: '🧬',
    subject: 'Biologia',
    color: 'from-green-500 to-emerald-500',
    content: 'O DNA é a molécula que carrega as informações genéticas de todos os seres vivos.',
    details: 'A dupla hélice do DNA é formada por nucleotídeos. As bases nitrogenadas são: Adenina, Timina, Guanina e Citosina.',
    facts: ['O DNA humano tem 3 bilhões de pares de bases', '99.9% do DNA humano é idêntico', 'O DNA foi descoberto em 1953']
  },
  {
    id: 'lesson-4',
    title: 'Forças e Movimento',
    icon: '🚀',
    subject: 'Física',
    color: 'from-orange-500 to-red-500',
    content: 'As leis de Newton descrevem como as forças afetam o movimento dos objetos.',
    details: '1ª Lei: Inércia. 2ª Lei: F=ma. 3ª Lei: Ação e Reação. Toda força resulta em uma reação igual e oposta.',
    facts: ['A gravidade na Lua é 1/6 da Terra', 'A velocidade da luz é 300.000 km/s', 'Sem atrito, objetos deslizariam para sempre']
  },
  {
    id: 'lesson-5',
    title: 'Ecossistemas',
    icon: '🌍',
    subject: 'Ecologia',
    color: 'from-teal-500 to-green-500',
    content: 'Ecossistemas são comunidades de seres vivos que interagem entre si e com o ambiente.',
    details: 'Incluem produtores, consumidores e decompositores. A cadeia alimentar mostra o fluxo de energia entre os organismos.',
    facts: ['A Amazônia produz 20% do oxigênio', 'Os oceanos cobrem 71% da Terra', 'Uma abelha visita 2 milhões de flores']
  },
  {
    id: 'lesson-6',
    title: 'Eletricidade',
    icon: '⚡',
    subject: 'Física',
    color: 'from-yellow-500 to-amber-500',
    content: 'A eletricidade é o fluxo de elétrons através de um condutor.',
    details: 'Tensão (V), Corrente (A) e Resistência (Ω) são as grandezas fundamentais. Lei de Ohm: V = R × I.',
    facts: ['Um raio tem 30.000°C', 'O corpo humano conduz eletricidade', 'A eletricidade foi descoberta há 2600 anos']
  },
  {
    id: 'lesson-7',
    title: 'Células',
    icon: '🔬',
    subject: 'Biologia',
    color: 'from-indigo-500 to-violet-500',
    content: 'As células são as unidades básicas da vida. Existem células procarióticas e eucarióticas.',
    details: 'Organelas: núcleo, mitocôndria, ribossomos, retículo endoplasmático. A mitocôndria é a "usina de energia" da célula.',
    facts: ['O corpo tem 37 trilhões de células', 'Glóbulos vermelhos vivem 120 dias', 'Uma célula se divide a cada 24h']
  },
  {
    id: 'lesson-8',
    title: 'Tabela Periódica',
    icon: '📊',
    subject: 'Química',
    color: 'from-rose-500 to-pink-500',
    content: 'A tabela periódica organiza os elementos químicos por número atômico e propriedades.',
    details: 'São 7 períodos (linhas) e 18 grupos (colunas). Metais, não-metais e gases nobres têm propriedades diferentes.',
    facts: ['Mendeleev criou a tabela em 1869', 'O Ouro tem símbolo Au', 'O Carbono forma milhões de compostos']
  },
]

export default function LessonViewer() {
  const { completedLessons, completeLesson, setCurrentScreen } = useApp()
  const [selectedLesson, setSelectedLesson] = useState<typeof lessons[0] | null>(null)
  const [zoomed, setZoomed] = useState(false)

  if (selectedLesson) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-24 px-4 pt-6 max-w-lg mx-auto"
      >
        <button
          onClick={() => setSelectedLesson(null)}
          className="text-indigo-400 mb-4 flex items-center gap-2 hover:text-indigo-300"
        >
          ← Voltar às aulas
        </button>

        <div className={`bg-gradient-to-br ${selectedLesson.color} rounded-2xl p-6 mb-6`}>
          <span className="text-5xl mb-3 block">{selectedLesson.icon}</span>
          <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
          <p className="text-white/80 text-sm">{selectedLesson.subject}</p>
        </div>

        {/* Zoomable Content */}
        <motion.div
          layout
          className={`bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-4 border border-slate-700 cursor-pointer transition-all ${zoomed ? 'scale-110' : ''}`}
          onClick={() => setZoomed(!zoomed)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">📖 Conteúdo</h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
              {zoomed ? '🔍 Zoom Ativo' : 'Toque para zoom'}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">{selectedLesson.content}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-4 border border-slate-700"
        >
          <h3 className="font-bold text-white mb-3">🔎 Detalhes</h3>
          <p className="text-slate-300 leading-relaxed">{selectedLesson.details}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-4 border border-slate-700"
        >
          <h3 className="font-bold text-white mb-3">💡 Curiosidades</h3>
          <ul className="space-y-2">
            {selectedLesson.facts.map((fact, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-2 text-slate-300"
              >
                <span className="text-yellow-400">✨</span>
                <span>{fact}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {!completedLessons.includes(selectedLesson.id) && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              completeLesson(selectedLesson.id)
              setSelectedLesson(null)
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/25"
          >
            ✅ Marcar como Concluída (+50 XP)
          </motion.button>
        )}

        {completedLessons.includes(selectedLesson.id) && (
          <div className="text-center text-green-400 font-bold py-4">
            ✅ Lição Concluída!
          </div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setCurrentScreen('quiz')}
          className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-2xl"
        >
          🧠 Fazer Quiz sobre este tema
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2">📚 Aulas</h2>
      <p className="text-slate-400 mb-6">Explore o conhecimento com conteúdo interativo</p>

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <motion.button
            key={lesson.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedLesson(lesson)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              completedLessons.includes(lesson.id)
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-2xl`}>
              {lesson.icon}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white">{lesson.title}</h3>
              <p className="text-slate-400 text-sm">{lesson.subject}</p>
            </div>
            {completedLessons.includes(lesson.id) ? (
              <span className="text-green-400 text-xl">✅</span>
            ) : (
              <span className="text-slate-500 text-xl">→</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
