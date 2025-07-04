"use client"

import { Suspense, useRef, useMemo } from "react";
import type * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";

function GlassCube({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= 0.004
      innerRef.current.rotation.z += 0.002
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.01
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9
      coreRef.current.scale.setScalar(pulse * 0.3)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
  <group position={position} scale={scale}>
    {/* Outer glass cube */}
    <mesh ref={meshRef}>
  <boxGeometry args={[1, 1, 1]} />
  <meshPhysicalMaterial
  color="#8b5cf6"
  transparent
  opacity={0.1}
  roughness={0}
  metalness={0.1}
  clearcoat={1}
  clearcoatRoughness={0}
  transmission={0.9}
  thickness={0.5}
  />
  </mesh>
  {/* Inner rotating geometry */}
  <mesh ref={innerRef} scale={0.6}>
  <octahedronGeometry args={[0.5, 0]} />
  <meshStandardMaterial
  color="#06b6d4"
  emissive="#06b6d4"
  emissiveIntensity={0.3}
  transparent
  opacity={0.8}
  />
  </mesh>
  {/* Core energy ball */}
  <mesh ref={coreRef}>
  <sphereGeometry args={[0.15, 8, 8]} />
  <meshStandardMaterial
  color="#ffffff"
  emissive="#ffffff"
  emissiveIntensity={0.8}
  />
  </mesh>
  </group>
  </Float>
)
}

function WireframeSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.002
    }
    if (innerRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9
      innerRef.current.scale.setScalar(pulse)
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x += 0.005
      ringsRef.current.rotation.z += 0.003
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
  <group position={position}>
  <mesh ref={meshRef}>
  <sphereGeometry args={[0.8, 16, 16]} />
  <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
  </mesh>
  <mesh ref={innerRef}>
  <sphereGeometry args={[0.4, 8, 8]} />
  <meshStandardMaterial
  color="#06b6d4"
  emissive="#06b6d4"
  emissiveIntensity={0.5}
  transparent
  opacity={0.6}
  />
  </mesh>
  {/* Orbiting rings */}
  <group ref={ringsRef}>
  <mesh rotation={[0, 0, 0]}>
  <torusGeometry args={[1, 0.02, 8, 32]} />
  <meshStandardMaterial
  color="#8b5cf6"
  emissive="#8b5cf6"
  emissiveIntensity={0.4}
  />
  </mesh>
  <mesh rotation={[Math.PI / 2, 0, 0]}>
  <torusGeometry args={[1.1, 0.015, 8, 32]} />
  <meshStandardMaterial
  color="#06b6d4"
  emissive="#06b6d4"
  emissiveIntensity={0.4}
  />
  </mesh>
  <mesh rotation={[0, Math.PI / 2, 0]}>
  <torusGeometry args={[0.9, 0.025, 8, 32]} />
  <meshStandardMaterial
  color="#ffffff"
  emissive="#ffffff"
  emissiveIntensity={0.3}
  />
  </mesh>
  </group>
  </group>
  </Float>
)
}

function CompleteDNAHelix({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  const helixData = useMemo(() => {
    const strand1 = []
    const strand2 = []

    // Create more refined helix with better proportions
    for (let i = 0; i < 50; i++) {
      const t = (i / 50) * Math.PI * 6 // More turns for elegance
      const radius = 1.2
      const height = i * 0.1 - 2.5

      const pos1 = [Math.cos(t) * radius, height, Math.sin(t) * radius] as [number, number, number]
      const pos2 = [Math.cos(t + Math.PI) * radius, height, Math.sin(t + Math.PI) * radius] as [number, number, number]

      strand1.push(pos1)
      strand2.push(pos2)
    }

    return { strand1, strand2 }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
  <group position={position}>
  <group ref={groupRef}>
    {/* First strand - Purple with same style as spheres */}
  {helixData.strand1.map((pos, i) => (
    <mesh key={`strand1-${i}`} position={pos}>
  <sphereGeometry args={[0.06, 12, 12]} />
  <meshStandardMaterial
    color="#8b5cf6"
    emissive="#8b5cf6"
    emissiveIntensity={0.5}
    transparent
    opacity={0.8}
    />
    </mesh>
  ))}

  {/* Second strand - Cyan with same style as spheres */}
  {helixData.strand2.map((pos, i) => (
    <mesh key={`strand2-${i}`} position={pos}>
  <sphereGeometry args={[0.06, 12, 12]} />
  <meshStandardMaterial
    color="#06b6d4"
    emissive="#06b6d4"
    emissiveIntensity={0.5}
    transparent
    opacity={0.8}
    />
    </mesh>
  ))}

  {/* Floating data particles around the helix */}
  {Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const radius = 2.5 + Math.sin(i) * 0.5
    const height = (i / 12) * 5 - 2.5
    return (
      <mesh
        key={`particle-${i}`}
    position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
  >
    <sphereGeometry args={[0.03, 6, 6]} />
    <meshStandardMaterial
    color={i % 2 === 0 ? "#f59e0b" : "#10b981"}
    emissive={i % 2 === 0 ? "#f59e0b" : "#10b981"}
    emissiveIntensity={0.6}
    transparent
    opacity={0.7}
    />
    </mesh>
  )
  })}
  </group>
  </group>
  </Float>
)
}

function CosmicDust() {
  const dustRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (dustRef.current) {
      dustRef.current.rotation.y += 0.0005
      dustRef.current.rotation.x += 0.0002
    }
  })

  const dustParticles = useMemo(() =>
    Array.from({ length: 200 }, () => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60
      ] as [number, number, number],
      size: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.8 ? "#ffffff" : Math.random() > 0.6 ? "#8b5cf6" : "#06b6d4",
      intensity: Math.random() * 0.3 + 0.1
    })), []
  )

  return (
    <group ref={dustRef}>
      {dustParticles.map((particle, i) => (
          <mesh key={i} position={particle.position}>
        <sphereGeometry args={[particle.size, 4, 4]} />
  <meshStandardMaterial
  color={particle.color}
  emissive={particle.color}
  emissiveIntensity={particle.intensity}
  transparent
  opacity={0.4}
  />
  </mesh>
))}
  </group>
)
}

function DistantStars() {
  const starsRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001
    }
  })

  const stars = useMemo(() =>
    Array.from({ length: 1000 }, () => ({
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 100
      ] as [number, number, number],
      size: Math.random() * 0.015 + 0.003,
      brightness: Math.random() * 0.8 + 0.2
    })), []
  )

  return (
    <group ref={starsRef}>
      {stars.map((star, i) => (
          <mesh key={i} position={star.position}>
        <sphereGeometry args={[star.size, 4, 4]} />
  <meshStandardMaterial
  color="#ffffff"
  emissive="#ffffff"
  emissiveIntensity={star.brightness}
  transparent
  opacity={0.6}
  />
  </mesh>
))}
  </group>
)
}

// function SpaceNebula() {
//   const nebulaRef = useRef<THREE.Group>(null)
//
//   useFrame((state) => {
//     if (nebulaRef.current) {
//       nebulaRef.current.rotation.y += 0.0003
//       nebulaRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
//     }
//   })
//
//   const nebulaClouds = useMemo(() =>
//     Array.from({ length: 30 }, (_, i) => ({
//       position: [
//         (Math.random() - 0.5) * 80,
//         (Math.random() - 0.5) * 60,
//         (Math.random() - 0.5) * 80
//       ] as [number, number, number],
//       scale: Math.random() * 3 + 1,
//       color: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#06b6d4" : "#a855f7",
//       opacity: Math.random() * 0.1 + 0.03
//     })), []
//   )
//
//   return (
//     <group ref={nebulaRef}>
//       {nebulaClouds.map((cloud, i) => (
//           <mesh key={i} position={cloud.position} scale={cloud.scale}>
//         <sphereGeometry args={[1, 8, 8]} />
//   <meshStandardMaterial
//   color={cloud.color}
//   emissive={cloud.color}
//   emissiveIntensity={0.2}
//   transparent
//   opacity={cloud.opacity}
//   />
//   </mesh>
// ))}
//   </group>
// )
// }

function OrbitingDataNodes() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRingRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = -state.clock.elapsedTime * 0.5
      innerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  const outerNodes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const radius = 14
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle * 0.5) * 3, Math.sin(angle) * radius] as [number, number, number],
        color: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#06b6d4" : "#ffffff",
        size: 0.08 + Math.random() * 0.04
      }
    })
  }, [])

  const innerNodes = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2
      const radius = 8
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle * 0.3) * 1.5, Math.sin(angle) * radius] as [number, number, number],
        color: i % 2 === 0 ? "#8b5cf6" : "#06b6d4",
        size: 0.06 + Math.random() * 0.03
      }
    })
  }, [])

  return (
    <>
      <group ref={groupRef}>
      {outerNodes.map((node, i) => (
          <mesh key={i} position={node.position}>
        <sphereGeometry args={[node.size, 8, 8]} />
  <meshStandardMaterial
  color={node.color}
  emissive={node.color}
  emissiveIntensity={0.6}
  />
  </mesh>
))}
  </group>

  <group ref={innerRingRef}>
    {innerNodes.map((node, i) => (
        <mesh key={i} position={node.position}>
      <sphereGeometry args={[node.size, 8, 8]} />
  <meshStandardMaterial
  color={node.color}
  emissive={node.color}
  emissiveIntensity={0.8}
  />
  </mesh>
))}
  </group>
  </>
)
}

function CleanParticleField() {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008
      particlesRef.current.rotation.x += 0.0003
    }
  })

  const particles = useMemo(() =>
    Array.from({ length: 80 }, () => ({
      position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40] as [number, number, number],
      size: Math.random() * 0.04 + 0.01,
      color: Math.random() > 0.7 ? "#ffffff" : Math.random() > 0.5 ? "#8b5cf6" : "#06b6d4",
      intensity: Math.random() * 0.5 + 0.3
    })), []
  )

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
          <mesh key={i} position={particle.position}>
        <sphereGeometry args={[particle.size, 4, 4]} />
  <meshStandardMaterial
  color={particle.color}
  emissive={particle.color}
  emissiveIntensity={particle.intensity}
  transparent
  opacity={0.8}
  />
  </mesh>
))}
  </group>
)
}

function QuantumNetwork() {
  const groupRef = useRef<THREE.Group>(null)

  const networkData = useMemo(() => {
    const nodes = Array.from({ length: 18 }, () => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 25
      ] as [number, number, number],
      type: Math.random() > 0.5 ? 'primary' : 'secondary'
    }))

    return { nodes }
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {/* Network nodes */}
  {networkData.nodes.map((node, i) => (
    <mesh key={i} position={node.position}>
  <octahedronGeometry args={[node.type === 'primary' ? 0.12 : 0.08, 0]} />
  <meshStandardMaterial
    color={node.type === 'primary' ? "#8b5cf6" : "#06b6d4"}
    emissive={node.type === 'primary' ? "#8b5cf6" : "#06b6d4"}
    emissiveIntensity={0.4}
    transparent
    opacity={0.9}
    />
    </mesh>
  ))}
  </group>
)
}

// Main 3D Scene
export default function HeroScene() {
  return (
    <div className="w-full h-full">
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
  id="three-canvas"
  gl={{ antialias: true, alpha: true }}
  dpr={[1, 2]}
>
  <Suspense fallback={null}>
    {/* Enhanced Lighting Setup */}
    <ambientLight intensity={0.15} />
  <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
  <pointLight position={[-10, -10, -10]} intensity={0.7} color="#06b6d4" />
  <pointLight position={[0, 15, 0]} intensity={0.4} color="#ffffff" />
  <spotLight
    position={[15, 15, 15]}
  angle={0.3}
  penumbra={1}
  intensity={0.6}
  color="#8b5cf6"
  />
  <spotLight
    position={[-15, -15, -15]}
  angle={0.3}
  penumbra={1}
  intensity={0.4}
  color="#06b6d4"
    />

    {/* Space Environment Layers */}
    <DistantStars />
    {/*<SpaceNebula />*/}
    <CosmicDust />

    {/* Enhanced Glass Cubes */}
    <GlassCube position={[-4, 2, -5]} scale={1.2} />
  <GlassCube position={[4, -1, -3]} scale={0.8} />
  <GlassCube position={[0, 3, -8]} scale={1.5} />
  <GlassCube position={[-6, -2, -6]} scale={1} />
  <GlassCube position={[6, 1, -4]} scale={0.9} />

  {/* Enhanced Wireframe Spheres */}
  <WireframeSphere position={[-2, -3, -2]} />
  <WireframeSphere position={[3, 2, -6]} />
  <WireframeSphere position={[-5, 1, -4]} />

  {/* Clean DNA Helixes */}
  <CompleteDNAHelix position={[8, 0, -8]} />
  <CompleteDNAHelix position={[-8, 2, -6]} />

  {/* Complex orbital systems */}
  <OrbitingDataNodes />
  <QuantumNetwork />
  <CleanParticleField />

  <Environment preset="night" />
  <OrbitControls
    enableZoom={false}
  enablePan={false}
  autoRotate
  autoRotateSpeed={0.2}
  maxPolarAngle={Math.PI / 1.8}
  minPolarAngle={Math.PI / 3}
  />
  </Suspense>
  </Canvas>
  </div>
)
}

//TODO Add a toast to show that the 3d animation is loading