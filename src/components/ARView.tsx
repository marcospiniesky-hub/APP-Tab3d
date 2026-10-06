import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sphere, Box, Torus, Text } from '@react-three/drei'
import * as THREE from 'three'

function ARMolecule() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Water molecule H2O */}
      {/* Oxygen */}
      <Sphere args={[0.4, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
      </Sphere>
      {/* Hydrogen 1 */}
      <Sphere args={[0.25, 32, 32]} position={[0.8, 0.5, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
      </Sphere>
      {/* Hydrogen 2 */}
      <Sphere args={[0.25, 32, 32]} position={[-0.8, 0.5, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
      </Sphere>
      {/* Bonds */}
      <mesh position={[0.4, 0.25, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-0.4, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  )
}

function ARPlanet() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        <Sphere ref={meshRef} args={[0.8, 64, 64]}>
          <meshStandardMaterial color="#6366f1" metalness={0.3} roughness={0.7} />
        </Sphere>
        {/* Ring */}
        <Torus args={[1.3, 0.08, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial color="#a78bfa" transparent opacity={0.7} />
        </Torus>
        {/* Moon */}
        <Float speed={3} rotationIntensity={0} floatIntensity={1}>
          <Sphere args={[0.15, 16, 16]} position={[1.8, 0.3, 0]}>
            <meshStandardMaterial color="#d4d4d8" />
          </Sphere>
        </Float>
      </group>
    </Float>
  )
}

function ARDNA() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const helixPoints = Array.from({ length: 20 }, (_, i) => {
    const t = i * 0.5
    return {
      pos1: [Math.cos(t) * 0.5, t * 0.3 - 3, Math.sin(t) * 0.5] as [number, number, number],
      pos2: [Math.cos(t + Math.PI) * 0.5, t * 0.3 - 3, Math.sin(t + Math.PI) * 0.5] as [number, number, number],
    }
  })

  return (
    <group ref={groupRef}>
      {helixPoints.map((point, i) => (
        <group key={i}>
          <Sphere args={[0.08, 8, 8]} position={point.pos1}>
            <meshStandardMaterial color={i % 2 === 0 ? '#10b981' : '#6366f1'} emissive={i % 2 === 0 ? '#10b981' : '#6366f1'} emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.08, 8, 8]} position={point.pos2}>
            <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#ef4444'} emissive={i % 2 === 0 ? '#f59e0b' : '#ef4444'} emissiveIntensity={0.5} />
          </Sphere>
          {i % 3 === 0 && (
            <mesh position={[
              (point.pos1[0] + point.pos2[0]) / 2,
              point.pos1[1],
              (point.pos1[2] + point.pos2[2]) / 2
            ]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
              <meshStandardMaterial color="#94a3b8" transparent opacity={0.5} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

export default function ARView() {
  const [selectedModel, setSelectedModel] = useState<'molecule' | 'planet' | 'dna'>('molecule')
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(() => {
          // Camera not available, use fallback
        })
    }
  }, [cameraActive])

  const models = [
    { id: 'molecule' as const, name: 'H₂O', icon: '💧', desc: 'Molécula de Água' },
    { id: 'planet' as const, name: 'Planeta', icon: '🪐', desc: 'Planeta com Anéis' },
    { id: 'dna' as const, name: 'DNA', icon: '🧬', desc: 'Dupla Hélice' },
  ]

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2">📱 Realidade Aumentada</h2>
      <p className="text-slate-400 mb-4">Visualize modelos 3D no mundo real</p>

      {/* AR Viewport */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-80 rounded-2xl overflow-hidden border-2 border-indigo-500/30 mb-4"
      >
        {/* Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: cameraActive ? 'block' : 'none' }}
        />
        
        {/* 3D Overlay */}
        <div className="absolute inset-0 bg-slate-900/50">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a78bfa" />
            
            {selectedModel === 'molecule' && <ARMolecule />}
            {selectedModel === 'planet' && <ARPlanet />}
            {selectedModel === 'dna' && <ARDNA />}
            
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        {/* AR Overlay UI */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur rounded-full px-3 py-1">
          <span className="text-xs text-white">📍 AR Mode</span>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur rounded-full px-3 py-1">
          <span className="text-xs text-white">🔍 Pinça para zoom</span>
        </div>

        {/* Scan lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />
        </div>
      </motion.div>

      {/* Camera Toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setCameraActive(!cameraActive)}
        className={`w-full mb-4 py-3 rounded-xl font-bold ${
          cameraActive
            ? 'bg-red-500/20 border border-red-500/30 text-red-300'
            : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
        }`}
      >
        {cameraActive ? '📷 Desligar Câmera' : '📷 Ativar Câmera para AR'}
      </motion.button>

      {/* Model Selection */}
      <h3 className="font-bold text-white mb-3">Selecione um modelo:</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {models.map((model) => (
          <motion.button
            key={model.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedModel(model.id)}
            className={`p-3 rounded-xl border text-center transition-all ${
              selectedModel === model.id
                ? 'bg-indigo-600/30 border-indigo-500/50'
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            <span className="text-2xl block mb-1">{model.icon}</span>
            <span className="text-xs text-slate-300">{model.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Info Panel */}
      <motion.div
        key={selectedModel}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700"
      >
        {selectedModel === 'molecule' && (
          <div>
            <h4 className="font-bold text-cyan-300 mb-2">💧 Molécula de Água (H₂O)</h4>
            <p className="text-slate-300 text-sm">A água é composta por 2 átomos de hidrogênio e 1 de oxigênio. O ângulo entre as ligações é de 104.5°.</p>
            <div className="mt-2 flex gap-2">
              <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">O = Oxigênio</span>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">H = Hidrogênio</span>
            </div>
          </div>
        )}
        {selectedModel === 'planet' && (
          <div>
            <h4 className="font-bold text-purple-300 mb-2">🪐 Planeta com Anéis</h4>
            <p className="text-slate-300 text-sm">Modelo de um planeta gasoso com sistema de anéis, similar a Saturno. Os anéis são compostos de gelo e rocha.</p>
            <div className="mt-2 flex gap-2">
              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">Anéis de gelo</span>
              <span className="bg-slate-500/20 text-slate-300 text-xs px-2 py-1 rounded-full">Lua natural</span>
            </div>
          </div>
        )}
        {selectedModel === 'dna' && (
          <div>
            <h4 className="font-bold text-green-300 mb-2">🧬 DNA - Dupla Hélice</h4>
            <p className="text-slate-300 text-sm">O DNA tem estrutura de dupla hélice. As bases se conectam: A-T e G-C. Cada volta completa tem 10 pares de bases.</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">A - Adenina</span>
              <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">G - Guanina</span>
              <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">T - Timina</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full">C - Citosina</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
