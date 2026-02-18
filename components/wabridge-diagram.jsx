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
    // Compute line distances for dashed material to work
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

    // Fade in/out near endpoints
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
    const segments = 8 // per corner

    const pts = []

    // Bottom edge (left to right)
    pts.push(new THREE.Vector3(-w + r, -h, 0))
    pts.push(new THREE.Vector3(w - r, -h, 0))
    // Bottom-right corner
    for (let i = 0; i <= segments; i++) {
      const angle = -Math.PI / 2 + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(w - r + r * Math.cos(angle), -h + r + r * Math.sin(angle), 0))
    }
    // Right edge (bottom to top)
    pts.push(new THREE.Vector3(w, h - r, 0))
    // Top-right corner
    for (let i = 0; i <= segments; i++) {
      const angle = 0 + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(w - r + r * Math.cos(angle), h - r + r * Math.sin(angle), 0))
    }
    // Top edge (right to left)
    pts.push(new THREE.Vector3(-w + r, h, 0))
    // Top-left corner
    for (let i = 0; i <= segments; i++) {
      const angle = Math.PI / 2 + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(-w + r + r * Math.cos(angle), h - r + r * Math.sin(angle), 0))
    }
    // Left edge (top to bottom)
    pts.push(new THREE.Vector3(-w, -h + r, 0))
    // Bottom-left corner
    for (let i = 0; i <= segments; i++) {
      const angle = Math.PI + (Math.PI / 2) * (i / segments)
      pts.push(new THREE.Vector3(-w + r + r * Math.cos(angle), -h + r + r * Math.sin(angle), 0))
    }

    // Close loop
    pts.push(pts[0].clone())

    const geo = new THREE.BufferGeometry().setFromPoints(pts)

    // Compute cumulative line distances for dashed rendering
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
      {/* Glow fill for center node */}
      {isCenter && glowShape && (
        <mesh ref={glowRef} position={[0, 0, -0.05]}>
          <shapeGeometry args={[glowShape]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
      )}

      {/* Dashed border */}
      <RoundedRectBorder
        width={width}
        height={height}
        color={color}
        opacity={isCenter ? 0.9 : 0.6}
      />

      {/* Label text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={isCenter ? 0.28 : 0.22}
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

// Floating text label for connections
function ConnectionLabel({ position, text, color = "#f87171" }) {
  return (
    <Text
      position={position}
      fontSize={0.14}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.55}
    >
      {text}
    </Text>
  )
}

function Scene() {
  const { viewport } = useThree()

  const scale = Math.min(viewport.width / 10, viewport.height / 6, 1)

  // Node positions
  const nodes = {
    amibroker: [-3.8, 1.5, 0],
    tradingview: [-3.8, 0, 0],
    python: [-3.8, -1.5, 0],
    wabridge: [0, 0.3, 0],
    whatsapp: [3.8, 0.3, 0],
    yourApp: [0, -2.0, 0],
  }

  // Connection paths (edge to edge)
  const connections = {
    amiToWa: { start: [-2.6, 1.5, 0], end: [-1.0, 0.6, 0] },
    tvToWa: { start: [-2.6, 0, 0], end: [-1.0, 0.3, 0] },
    pyToWa: { start: [-2.6, -1.5, 0], end: [-1.0, 0.0, 0] },
    waToWhatsapp: { start: [1.0, 0.3, 0], end: [2.6, 0.3, 0] },
    appToWa: { start: [0, -1.3, 0], end: [0, -0.4, 0] },
  }

  const c = "#f87171"

  return (
    <group scale={[scale, scale, 1]}>
      {/* Source nodes */}
      <BlockNode position={nodes.amibroker} width={2} height={0.7} label="Amibroker" color={c} />
      <BlockNode position={nodes.tradingview} width={2} height={0.7} label="TradingView" color={c} />
      <BlockNode position={nodes.python} width={2} height={0.7} label="Python" color={c} />

      {/* Hub node */}
      <BlockNode position={nodes.wabridge} width={2} height={1.0} label="WABridge" color={c} isCenter />

      {/* Destination */}
      <BlockNode position={nodes.whatsapp} width={2} height={0.7} label="WhatsApp" color={c} />

      {/* Bottom node */}
      <BlockNode position={nodes.yourApp} width={1.8} height={0.7} label="Your App" color={c} />

      {/* Connection labels */}
      <ConnectionLabel position={[-2.2, -0.7, 0]} text="via ngrok" color={c} />
      <ConnectionLabel position={[0.65, -1.0, 0]} text="Direct API Call" color={c} />

      {/* Dashed connection lines */}
      <DashedLine start={connections.amiToWa.start} end={connections.amiToWa.end} color={c} speed={1} />
      <DashedLine start={connections.tvToWa.start} end={connections.tvToWa.end} color={c} speed={1.2} />
      <DashedLine start={connections.pyToWa.start} end={connections.pyToWa.end} color={c} speed={0.9} />
      <DashedLine start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color={c} speed={1.1} />
      <DashedLine start={connections.appToWa.start} end={connections.appToWa.end} color={c} speed={1} />

      {/* Arrow heads at connection endpoints */}
      <ArrowHead position={[-1.1, 0.55, 0]} rotation={-Math.PI / 6} color={c} />
      <ArrowHead position={[-1.1, 0.3, 0]} rotation={0} color={c} />
      <ArrowHead position={[-1.1, 0.05, 0]} rotation={Math.PI / 6} color={c} />
      <ArrowHead position={[2.5, 0.3, 0]} rotation={-Math.PI / 2} color={c} />
      <ArrowHead position={[0, -0.5, 0]} rotation={0} color={c} />

      {/* Animated flow particles - yellow flowing in, green flowing out */}
      <FlowParticle start={connections.amiToWa.start} end={connections.amiToWa.end} color="#fbbf24" speed={0.6} delay={0} />
      <FlowParticle start={connections.tvToWa.start} end={connections.tvToWa.end} color="#fbbf24" speed={0.7} delay={1} />
      <FlowParticle start={connections.pyToWa.start} end={connections.pyToWa.end} color="#fbbf24" speed={0.5} delay={2} />
      <FlowParticle start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color="#34d399" speed={0.6} delay={0.5} />
      <FlowParticle start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color="#34d399" speed={0.6} delay={1.5} />
      <FlowParticle start={connections.waToWhatsapp.start} end={connections.waToWhatsapp.end} color="#34d399" speed={0.6} delay={2.5} />
      <FlowParticle start={connections.appToWa.start} end={connections.appToWa.end} color="#fbbf24" speed={0.55} delay={1.5} />
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
      <div className="w-full h-[400px] md:h-[450px] bg-card/50 rounded-lg border border-dashed border-muted-foreground/20 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading diagram...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] md:h-[450px] rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
