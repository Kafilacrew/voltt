import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, ContactShadows, Text, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function ProteinBar3D({ isHovered }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.04
    }
  })

  return (
    <group ref={meshRef} scale={isHovered ? 1.05 : 1} transition="scale 0.3s ease">
      {/* Studio Bar Wrapper in Logo Deep Navy */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.25, 0.5]} />
        <meshPhysicalMaterial
          color="#153B75"
          roughness={0.25}
          metalness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          reflectivity={0.9}
        />
      </mesh>

      {/* Gold Foil Accent End Tabs */}
      <mesh position={[-1.72, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 1.3, 0.52]} />
        <meshStandardMaterial color="#D8A24A" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.72, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 1.3, 0.52]} />
        <meshStandardMaterial color="#D8A24A" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Center Studio Dark Navy Band */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[2.4, 1.1, 0.49]} />
        <meshStandardMaterial color="#0F2C59" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Clean 3D Brand Logo Text */}
      <Text
        position={[0, 0.08, 0.28]}
        fontSize={0.44}
        font="https://fonts.gstatic.com/s/outfit/v11/Q8cdrhx0R3pM0arU20a4zw.woff"
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        fontWeight={900}
      >
        VOLTT
      </Text>

      {/* Mono Subtitle in Honey Gold */}
      <Text
        position={[0, -0.28, 0.28]}
        fontSize={0.11}
        color="#D8A24A"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
        fontWeight={700}
      >
        10G PROTEIN • ELECTROLYTES
      </Text>
    </group>
  )
}

export default function VolttBarModel() {
  const [isHovered, setIsHovered] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="relative w-full h-[420px] flex items-center justify-center p-4">
        <img
          src="/assets/hero.png"
          alt="Voltt Bar"
          className="max-h-[340px] w-auto object-contain drop-shadow-xl"
        />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-[380px] sm:h-[460px] cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        onError={() => setHasError(true)}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5.2]} fov={44} />

        {/* Soft Studio Lighting */}
        <ambientLight intensity={0.95} />
        <directionalLight position={[6, 8, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-6, -4, -4]} intensity={0.4} color="#153B75" />
        <spotLight position={[0, 4, 3]} intensity={1} color="#F7F4EC" angle={0.5} penumbra={1} />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
          <ProteinBar3D isHovered={isHovered} />
        </Float>

        {/* Soft Floor Shadow */}
        <ContactShadows position={[0, -1.8, 0]} opacity={0.35} scale={7} blur={2} far={4} color="#153B75" />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.7} minPolarAngle={Math.PI / 3} />
      </Canvas>

      {/* Interactive Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-[#153B75] text-white text-[10px] font-mono shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D8A24A]" />
        <span>3D MODEL • DRAG TO ROTATE</span>
      </div>
    </div>
  )
}
