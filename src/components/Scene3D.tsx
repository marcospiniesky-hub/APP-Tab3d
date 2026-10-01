import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus, Text3D, Center } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function RotatingAtom() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <Sphere args={[0.5, 32, 32]}>
        <MeshDistortMaterial
          color="#6366f1"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Electron orbits */}
      {[0, 1, 2].map((i) => (
        <Torus key={i} args={[1.5, 0.02, 16, 100]} rotation={[Math.PI / 3 * i, Math.PI / 4 * i, 0]}>
          <meshStandardMaterial color="#a78bfa" transparent opacity={0.6} />
        </Torus>
      ))}
      
      {/* Electrons */}
      {[0, 1, 2].map((i) => (
        <ElectronOnOrbit key={`e-${i}`} orbitIndex={i} />
      ))}
    </group>
  )
}

function ElectronOnOrbit({ orbitIndex }: { orbitIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * (1.5 + orbitIndex * 0.5)
      const radius = 1.5
      const angle = t + (orbitIndex * Math.PI * 2 / 3)
      
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle) * Math.cos(Math.PI / 3 * orbitIndex)
      const z = radius * Math.sin(angle) * Math.sin(Math.PI / 3 * orbitIndex)
      
      meshRef.current.position.set(x, y, z)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
    </mesh>
  )
}

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Box ref={meshRef} args={[0.6, 0.6, 0.6]} position={[2.5, 1, -1]}>
        <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.2} />
      </Box>
    </Float>
  )
}

function FloatingPyramid() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[-2.5, -0.5, -1]}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>
    </Float>
  )
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f472b6" />
      <spotLight position={[0, 5, 5]} intensity={0.8} angle={0.5} penumbra={1} color="#a78bfa" />
      
      <RotatingAtom />
      <FloatingCube />
      <FloatingPyramid />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
