"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

// Dashed line between two 3D points with animated dash offset
function DashedLine({ start, end, color = "#f87171", speed = 1 }) {
  const ref = useRef()
  const materialRef = useRef()

  const geometry = useMemo(() => {
    const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const dist = pts[0].distanceTo(pts[1])
    const lineDistances = new Float32Array([0, dist])
    geo.setAttribute("lineDistance", new THREE.BufferAttribute(lineDistances, 1))
    return geo
  }, [start, end])

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.dashOffset -= 0.02 * speed
    }
  })

  return (
    <line ref={ref} geometry={geometry}>
      <lineDashedMaterial
        ref={materialRef}
        color={color}
        dashSize={0.15}
        gapSize={0.1}
        transparent
        opacity={0.7}
      />
    </line>
  )
}

// Animated dot that travels from start to end repeatedly
function FlowParticle({ start, end, color = "#fbbf24", speed = 0.6, delay = 0, size = 0.08 }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = ((state.clock.elapsedTime * speed + delay) % 3) / 3
    ref.current.position.x = start[0] + (end[0] - start[0]) * t
    ref.current.position.y = start[1] + (end[1] - start[1]) * t
    ref.current.position.z = 0.05

    const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1
    ref.current.material.opacity = opacity * 0.9
  })

  return (
    <mesh ref={ref} position={[start[0], start[1], 0.05]}>
      <circleGeometry args={[size, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  )
}

// Rounded rectangle border drawn as a dashed line loop
function RoundedRectBorder({ width, height, radius = 0.15, color = "#f87171", opacity = 0.6 }) {
  const geometry = useMemo(() => {
    const w = width / 2
    const h = height / 2
    const r = Math.min(radius, w, h)
    const segments = 8

    const pts = []

    pts.push(new THREE.Vector3(-w + r, -h, 0))
    pts.push(new THREE.Vector3(w - r, -h, 0))
    for (let i = 0; i <= segments; i++) {
      const angle = -Math.PI / 2 + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(w - r + r * Math.cos(angle), -h + r + r * Math.sin(angle), 0))
    }
    pts.push(new THREE.Vector3(w, h - r, 0))
    for (let i = 0; i <= segments; i++) {
      const angle = 0 + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(w - r + r * Math.cos(angle), h - r + r * Math.sin(angle), 0))
    }
    pts.push(new THREE.Vector3(-w + r, h, 0))
    for (let i = 0; i <= segments; i++) {
      const angle = Math.PI / 2 + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(-w + r + r * Math.cos(angle), h - r + r * Math.sin(angle), 0))
    }
    pts.push(new THREE.Vector3(-w, -h + r, 0))
    for (let i = 0; i <= segments; i++) {
      const angle = Math.PI + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(-w + r + r * Math.cos(angle), -h + r + r * Math.sin(angle), 0))
    }

    pts.push(pts[0].clone())

    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const distances = [0]
    for (let i = 1; i < pts.length; i++) {
      distances.push(distances[i - 1] + pts[i - 1].distanceTo(pts[i]))
    }
    geo.setAttribute("lineDistance", new THREE.Float32BufferAttribute(distances, 1))

    return geo
  }, [width, height, radius])

  return (
    <line geometry={geometry}>
      <lineDashedMaterial
        color={color}
        dashSize={0.12}
        gapSize={0.08}
        transparent
        opacity={opacity}
      />
    </line>
  )
}

// Block node with dashed rounded rectangle border, optional glow, and text label
function BlockNode({ position, width, height, label, color = "#f87171", isCenter = false }) {
  const glowRef = useRef()

  const glowShape = useMemo(() => {
    if (!isCenter) return null
    const s = new THREE.Shape()
    const r = 0.15
    const w = width / 2
    const h = height / 2
    s.moveTo(-w + r, -h)
    s.lineTo(w - r, -h)
    s.quadraticCurveTo(w, -h, w, -h + r)
    s.lineTo(w, h - r)
    s.quadraticCurveTo(w, h, w - r, h)
    s.lineTo(-w + r, h)
    s.quadraticCurveTo(-w, h, -w, h - r)
    s.lineTo(-w, -h + r)
    s.quadraticCurveTo(-w, -h, -w + r, -h)
    return s
  }, [width, height, isCenter])

  useFrame((state) => {
    if (glowRef.current && isCenter) {
      glowRef.current.material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 2) * 0.04
    }
  })

  return (
    <group position={position}>
      {isCenter && glowShape && (
        <mesh ref={glowRef} position={[0, 0, -0.05]}>
          <shapeGeometry args={[glowShape]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
      )}

      <RoundedRectBorder
        width={width}
        height={height}
        color={color}
        opacity={isCenter ? 0.9 : 0.6}
      />

      <Text
        position={[0, 0, 0.1]}
        fontSize={isCenter ? 0.28 : 0.24}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

// Small triangle arrow head
function ArrowHead({ position, rotation = 0, color = "#f87171" }) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh>
        <coneGeometry args={[0.06, 0.14, 3]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function Scene() {
  const { viewport } = useThree()

  const scale = Math.min(viewport.width / 10, viewport.height / 4, 1)

  const c = "#f87171"

  // Three nodes in a horizontal line: Your App -> WABridge -> WhatsApp
  const nodes = {
    yourApp: [-3.5, 0, 0],
    wabridge: [0, 0, 0],
    whatsapp: [3.5, 0, 0],
  }

  // Connections between nodes (edge to edge)
  const connections = {
    appToWa: { start: [-2.3, 0, 0], end: [-1.2, 0, 0] },
    waToWhatsapp: { start: [1.2, 0, 0], end: [2.3, 0, 0] },
  }

  return (
    <group scale={[scale, scale, 1]}>
      {/* Your App */}
      <BlockNode position={nodes.yourApp} width={2.2} height={0.9} label="Your App" color={c} />

      {/* WABridge (center, highlighted) */}
      <BlockNode position={nodes.wabridge} width={2.2} height={1.0} label="WABridge" color={c} isCenter />

      {/* WhatsApp */}
      <BlockNode position={nodes.whatsapp} width={2.2} height={0.9} label="WhatsApp" color={c} />

      {/* Dashed connection lines */}
      <DashedLine start={connections.appToWa.start} end={connections.appToWa.end} color={c} speed={1} />
      <DashedLine start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color={c} speed={1.1} />

      {/* Arrow heads pointing right */}
      <ArrowHead position={[-1.3, 0, 0]} rotation={-Math.PI / 2} color={c} />
      <ArrowHead position={[2.2, 0, 0]} rotation={-Math.PI / 2} color={c} />

      {/* Animated flow particles */}
      <FlowParticle start={connections.appToWa.start} end={connections.appToWa.end} color="#fbbf24" speed={0.6} delay={0} />
      <FlowParticle start={connections.appToWa.start} end={connections.appToWa.end} color="#fbbf24" speed={0.6} delay={1.5} />
      <FlowParticle start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color="#34d399" speed={0.6} delay={0.5} />
      <FlowParticle start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color="#34d399" speed={0.6} delay={2} />
    </group>
  )
}

export default function WABridgeDiagram() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[300px] md:h-[350px] bg-card/50 rounded-lg border border-dashed border-muted-foreground/20 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading diagram...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] md:h-[350px] rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
