import { useEffect, useRef } from 'react'

// Animated node graph behind the hero. Nodes drift and link up; the cursor attracts nearby nodes.
// While paused it draws one still frame.
export default function NetworkCanvas({ paused }) {
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)
  const playRef = useRef(null)

  useEffect(() => {
    pausedRef.current = paused
    if (!paused) playRef.current?.()
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const mouse = { x: -9999, y: -9999 }
    let nodes = []
    let raf = 0
    let w = 0
    let h = 0

    const color = () => getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '56,189,248'

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (w * h) / 14000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }))
    }

    function frame() {
      const rgb = color()
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const d = Math.hypot(dx, dy)
        if (d < 160) {
          n.vx += (dx / d) * 0.012
          n.vy += (dy / d) * 0.012
        }
        n.vx *= 0.99
        n.vy *= 0.99
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / 120) * 0.35})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        ctx.fillStyle = `rgba(${rgb},${md < 160 ? 0.95 : 0.6})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!pausedRef.current) raf = requestAnimationFrame(frame)
    }

    playRef.current = () => {
      cancelAnimationFrame(raf)
      frame()
    }
    const onResize = () => {
      resize()
      if (pausedRef.current) frame()
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }

    resize()
    frame()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="network-canvas" aria-hidden="true" />
}
