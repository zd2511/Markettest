import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    const loop = () => {
      rx += (x - rx) * 0.22; ry += (y - ry) * 0.22
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move); loop()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return <><div className="cursor-dot" ref={dot}/><div className="cursor-ring" ref={ring}/></>
}