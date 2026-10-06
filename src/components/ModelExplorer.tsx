import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box, Torus, Cylinder, Cone, Float, MeshDistortMaterial, Text } from '@react-three/drei'
import * as THREE from 'three'

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const points = Array.from({ length: 30 }, (_, i) => {
    const t = i * 0.4
    return {
      pos1: [Math.cos(t) * 0.8, t * 0.25 - 3.5, Math.sin(t) * 0.8] as [number, number, number],
      pos2: [Math.cos(t + Math.PI) * 0.8, t * 0.25 - 3.5, Math.sin(t + Math.PI) * 0.8] as [number, number, number],
    }
  })

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <group key={i}>
          <Sphere args={[0.12, 16, 16]} position={point.pos1}>
            <meshStandardMaterial
              color={i % 4 === 0 ? '#10b981' : i % 4 === 1 ? '#6366f1' : i % 4 === 2 ? '#f59e0b' : '#ef4444'}
              emissive={i % 4 === 0 ? '#10b981' : i % 4 === 1 ? '#6366f1' : i % 4 === 2 ? '#f59e0b' : '#ef4444'}
              emissiveIntensity={0.3}
            />
          </Sphere>
          <Sphere args={[0.12, 16, 16]} position={point.pos2}>
            <meshStandardMaterial
              color={i % 4 === 0 ? '#ef4444' : i % 4 === 1 ? '#f59e0b' : i % 4 === 2 ? '#6366f1' : '#10b981'}
              emissive={i % 4 === 0 ? '#ef4444' : i % 4 === 1 ? '#f59e0b' : i % 4 === 2 ? '#6366f1' : '#10b981'}
              emissiveIntensity={0.3}
            />
          </Sphere>
          {i % 2 === 0 && (
            <mesh position={[
              (point.pos1[0] + point.pos2[0]) / 2,
              point.pos1[1],
              (point.pos1[2] + point.pos2[2]) / 2
            ]} rotation={[0, Math.atan2(point.pos1[2] - point.pos2[2], point.pos1[0] - point.pos2[0]), Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 4]} />
              <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function SolarSystem() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const planets = [
    { name: 'Mercúrio', distance: 1.2, size: 0.1, color: '#94a3b8', speed: 4 },
    { name: 'Vênus', distance: 1.6, size: 0.15, color: '#f59e0b', speed: 3 },
    { name: 'Terra', distance: 2.1, size: 0.16, color: '#3b82f6', speed: 2.5 },
    { name: 'Marte', distance: 2.6, size: 0.12, color: '#ef4444', speed: 2 },
    { name: 'Júpiter', distance: 3.3, size: 0.35, color: '#d97706', speed: 1.2 },
    { name: 'Saturno', distance: 4.0, size: 0.3, color: '#fbbf24', speed: 0.8, hasRing: true },
  ]

  return (
    <group ref={groupRef}>
      {/* Sun */}
      <Sphere args={[0.5, 32, 32]}>
        <MeshDistortMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} distort={0.2} speed={3} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" />
      
      {planets.map((planet, i) => (
        <PlanetOrbit key={i} planet={planet} />
      ))}
    </group>
  )
}

function PlanetOrbit({ planet }: { planet: { name: string; distance: number; size: number; color: string; speed: number; hasRing?: boolean } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * planet.speed * 0.3
      meshRef.current.position.x = Math.cos(t) * planet.distance
      meshRef.current.position.z = Math.sin(t) * planet.distance
    }
  })

  return (
    <>
      {/* Orbit path */}
      <Torus args={[planet.distance, 0.005, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#475569" transparent opacity={0.3} />
      </Torus>
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 16, 16]} />
        <meshStandardMaterial color={planet.color} metalness={0.3} roughness={0.7} />
        {planet.hasRing && (
          <Torus args={[planet.size * 1.8, 0.03, 8, 50]} rotation={[Math.PI / 3, 0, 0]}>
            <meshStandardMaterial color="#fbbf24" transparent opacity={0.6} />
          </Torus>
        )}
      </mesh>
    </>
  )
}

function MoleculeModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Caffeine-like molecule */}
      {/* Central ring */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 1
        const z = Math.sin(angle) * 1
        return (
          <group key={i}>
            <Sphere args={[0.2, 16, 16]} position={[x, 0, z]}>
              <meshStandardMaterial
                color={i % 2 === 0 ? '#6366f1' : '#ef4444'}
                metalness={0.5}
                roughness={0.3}
                emissive={i % 2 === 0 ? '#6366f1' : '#ef4444'}
                emissiveIntensity={0.2}
              />
            </Sphere>
            {/* Bond to next atom */}
            <mesh
              position={[
                (x + Math.cos(((i + 1) / 6) * Math.PI * 2) * 1) / 2,
                0,
                (z + Math.sin(((i + 1) / 6) * Math.PI * 2) * 1) / 2
              ]}
              rotation={[0, -angle - Math.PI / 6, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        )
      })}
      
      {/* Side chains */}
      {[0, 2, 4].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 1
        const z = Math.sin(angle) * 1
        return (
          <group key={`side-${i}`}>
            <Sphere args={[0.15, 16, 16]} position={[x * 1.7, 0.5, z * 1.7]}>
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
            </Sphere>
            <mesh
              position={[x * 1.35, 0.25, z * 1.35]}
              rotation={[0, 0, Math.atan2(z, x) > 0 ? -0.5 : 0.5]}
            >
              <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

const models = [
  {
    id: 'dna',
    name: 'DNA - Dupla Hélice',
    icon: '🧬',
    description: 'A molécula de DNA possui estrutura de dupla hélice, com bases nitrogenadas conectadas por pontes de hidrogênio.',
    facts: ['3 bilhões de pares de bases', '2 metros de DNA em cada célula', 'Descoberto em 1953'],
    component: DNAHelix,
  },
  {
    id: 'solar',
    name: 'Sistema Solar',
    icon: '🪐',
    description: 'O Sistema Solar contém o Sol e 8 planetas que orbitam ao seu redor em diferentes velocidades.',
    facts: ['8 planetas', 'O Sol tem 4.6 bilhões de anos', 'Júpiter é 11x maior que a Terra'],
    component: SolarSystem,
  },
  {
    id: 'molecule',
    name: 'Molécula Orgânica',
    icon: '⚗️',
    description: 'Modelo de uma molécula orgânica complexa com anel hexagonal e cadeias laterais.',
    facts: ['Carbono forma 4 ligações', 'Milhões de compostos orgânicos', 'Base da vida'],
    component: MoleculeModel,
  },
]

export default function ModelExplorer() {
  const [selectedModel, setSelectedModel] = useState(0)
  const [showInfo, setShowInfo] = useState(true)

  const ModelComponent = models[selectedModel].component

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2">🧊 Explorador 3D</h2>
      <p className="text-slate-400 mb-4">Interaja com modelos científicos em 3D</p>

      {/* 3D Viewport */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-72 rounded-2xl overflow-hidden border-2 border-indigo-500/30 mb-4 bg-slate-900"
      >
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
          
          <ModelComponent />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={3}
            maxDistance={15}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Zoom controls overlay */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <div className="bg-black/50 backdrop-blur rounded-full px-3 py-1 text-xs text-white">
            🔍 Pinça para zoom
          </div>
          <div className="bg-black/50 backdrop-blur rounded-full px-3 py-1 text-xs text-white">
            🔄 Arraste para girar
          </div>
        </div>
      </motion.div>

      {/* Model Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {models.map((model, i) => (
          <motion.button
            key={model.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedModel(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all ${
              i === selectedModel
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}
          >
            <span className="mr-2">{model.icon}</span>
            <span className="text-sm font-medium whitespace-nowrap">{model.name.split(' - ')[0]}</span>
          </motion.button>
        ))}
      </div>

      {/* Info Panel */}
      <motion.div
        key={selectedModel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-lg">{models[selectedModel].icon} {models[selectedModel].name}</h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-indigo-400 text-sm"
          >
            {showInfo ? 'Esconder' : 'Mostrar'}
          </button>
        </div>
        
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <p className="text-slate-300 mb-3">{models[selectedModel].description}</p>
            <div className="space-y-2">
              {models[selectedModel].facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-yellow-400">✨</span>
                  <span className="text-slate-400 text-sm">{fact}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Controls Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/30 rounded-xl p-4 border border-slate-700"
      >
        <h4 className="font-bold text-white mb-2 text-sm">🎮 Controles</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 px-2 py-1 rounded">👆 Arrastar</span>
            <span>Girar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 px-2 py-1 rounded">🤏 Pinça</span>
            <span>Zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 px-2 py-1 rounded">👆👆 2 dedos</span>
            <span>Mover</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-700 px-2 py-1 rounded">🖱️ Scroll</span>
            <span>Zoom</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
