import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = { onReady?: () => void }

export default function Planet({ onReady }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!host.current || !canvas.current) return
    const mount = host.current
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current, alpha: true, antialias: true, powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0, 4.25)

    scene.add(new THREE.AmbientLight(0x8799c5, 1.05))
    const sun = new THREE.DirectionalLight(0xffc08a, 3.4)
    sun.position.set(-3.5, 2.3, 4)
    scene.add(sun)
    const rim = new THREE.PointLight(0xff642b, 24, 9)
    rim.position.set(3.5, -0.6, -2.4)
    scene.add(rim)
    const bounce = new THREE.PointLight(0xffa66b, 4, 7)
    bounce.position.set(-2, -2, 3)
    scene.add(bounce)

    const earthGroup = new THREE.Group()
    scene.add(earthGroup)
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff, shininess: 24, specular: new THREE.Color(0x62524b)
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1.28, 128, 128), earthMaterial)
    earthGroup.add(earth)

    const cloudMaterial = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.24, depthWrite: false })
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.294, 96, 96), cloudMaterial)
    earthGroup.add(clouds)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.33, 96, 96),
      new THREE.MeshBasicMaterial({ color: 0x69a7ff, transparent: true, opacity: 0.15, side: THREE.BackSide })
    )
    earthGroup.add(atmosphere)
    const fireRim = new THREE.Mesh(
      new THREE.SphereGeometry(1.355, 96, 96),
      new THREE.MeshBasicMaterial({ color: 0xff733b, transparent: true, opacity: 0.08, side: THREE.BackSide })
    )
    earthGroup.add(fireRim)

    const texture = (url: string, apply: (t: THREE.Texture) => void) => {
      loader.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; apply(t) }, undefined, () => {})
    }
    texture('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', t => {
      earthMaterial.map = t; earthMaterial.needsUpdate = true
    })
    texture('https://threejs.org/examples/textures/planets/earth_lights_2048.png', t => {
      earthMaterial.emissive = new THREE.Color(0xff8b49)
      earthMaterial.emissiveMap = t
      earthMaterial.emissiveIntensity = 0.72
      earthMaterial.needsUpdate = true
    })
    texture('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg', t => {
      earthMaterial.bumpMap = t; earthMaterial.bumpScale = 0.035; earthMaterial.needsUpdate = true
    })
    texture('https://threejs.org/examples/textures/planets/earth_clouds_1024.png', t => {
      cloudMaterial.map = t; cloudMaterial.alphaMap = t; cloudMaterial.needsUpdate = true
    })

    // Dense, deep-space star field with a few brighter stars.
    const starPositions: number[] = []
    for (let i = 0; i < 3200; i++) {
      const r = 12 + Math.random() * 32
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
    }
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffdfca, size: 0.034, transparent: true, opacity: 0.88 })))

    // Small orbital particles move around the planet in 3D space.
    const particleCount = 420
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 1.65 + Math.random() * 0.9
      particlePositions[i * 3] = Math.cos(a) * r
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.23
      particlePositions[i * 3 + 2] = Math.sin(a) * r
    }
    const orbitGeometry = new THREE.BufferGeometry()
    orbitGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const orbitParticles = new THREE.Points(orbitGeometry, new THREE.PointsMaterial({ color: 0xff8b4d, size: 0.018, transparent: true, opacity: 0.9 }))
    orbitParticles.rotation.x = -0.31
    orbitParticles.rotation.z = -0.25
    scene.add(orbitParticles)

    let dragging = false
    let lastX = 0
    let lastY = 0
    let velocity = 0
    const down = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY
      canvas.current?.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      earthGroup.rotation.y += dx * 0.006
      earthGroup.rotation.x = THREE.MathUtils.clamp(earthGroup.rotation.x + dy * 0.004, -0.55, 0.55)
      velocity = dx * 0.0008
      lastX = e.clientX; lastY = e.clientY
    }
    const up = () => { dragging = false }
    const wheel = (e: WheelEvent) => {
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.002, 3.15, 5.6)
    }
    canvas.current.addEventListener('pointerdown', down)
    canvas.current.addEventListener('pointermove', move)
    canvas.current.addEventListener('pointerup', up)
    canvas.current.addEventListener('pointercancel', up)
    canvas.current.addEventListener('wheel', wheel, { passive: true })

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()
    onReady?.()

    const clock = new THREE.Clock()
    let frame = 0
    let alive = true
    const animate = () => {
      if (!alive) return
      frame = requestAnimationFrame(animate)
      const dt = clock.getDelta()
      if (!dragging) {
        earthGroup.rotation.y += dt * 0.105 + velocity
        velocity *= 0.965
      }
      clouds.rotation.y = earthGroup.rotation.y * 0.94
      orbitParticles.rotation.y += dt * 0.035
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.current?.removeEventListener('pointerdown', down)
      canvas.current?.removeEventListener('pointermove', move)
      canvas.current?.removeEventListener('pointerup', up)
      canvas.current?.removeEventListener('pointercancel', up)
      canvas.current?.removeEventListener('wheel', wheel)
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const mat = object.material
          if (Array.isArray(mat)) mat.forEach(m => m.dispose())
          else mat.dispose()
        }
      })
      renderer.dispose()
    }
  }, [onReady])

  return <div className="planet-canvas-wrap" ref={host}>
    <canvas ref={canvas} aria-label="Interactive 3D planet. Drag to rotate and scroll to zoom." />
  </div>
}