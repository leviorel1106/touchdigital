'use client'
import { useRef, useEffect } from 'react'

// ── Shaders ────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = 0.5 * (a_position + 1.0);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Desktop: 3-octave FBM for detailed fire edge
const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform float u_burn;
uniform float u_time;
uniform float u_aspect;
uniform float u_image_aspect;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 st) {
  float v = 0.0; float amp = 0.5;
  for (int i = 0; i < 3; i++) { v += amp * noise(st); st *= 2.2; amp *= 0.45; }
  return v;
}

void main() {
  float baseLine = u_burn;
  vec2 nc = vec2(v_uv.x * u_aspect * 3.5 + u_time * 0.035, v_uv.y * 7.0 + u_time * 0.22);
  float edgeNoise = fbm(nc);
  float mainEdge = baseLine + (edgeNoise - 0.5) * 0.18;
  vec2 tc = vec2(v_uv.x * u_aspect * 7.0 + u_time * 0.018, v_uv.y * 4.0 + 100.0);
  float thickNoise = fbm(tc);
  float localThickness = mix(0.008, 0.055, thickNoise);
  float lower = mainEdge - localThickness * 0.4;
  float upper = mainEdge + localThickness * 0.6;
  float ratio = u_aspect / u_image_aspect;
  vec2 coverUV = vec2(0.5 + (v_uv.x - 0.5) * min(ratio, 1.0), 0.5 + (v_uv.y - 0.5) * min(1.0 / ratio, 1.0));
  vec4 img = texture2D(u_image, coverUV);
  if (v_uv.y < lower) {
    gl_FragColor = vec4(0.0);
  } else if (v_uv.y > upper) {
    float nearEdge = smoothstep(upper + localThickness * 3.0, upper, v_uv.y);
    vec3 edgeGlow = vec3(1.0, 0.38, 0.0) * nearEdge * 0.45;
    gl_FragColor = vec4(img.rgb + edgeGlow, img.a);
  } else {
    float t = (v_uv.y - lower) / (upper - lower);
    vec3 c1 = vec3(0.78, 0.05, 0.0); vec3 c2 = vec3(1.0, 0.34, 0.0); vec3 c3 = vec3(1.0, 0.82, 0.22);
    vec3 fireColor = t < 0.5 ? mix(c1, c2, t * 2.0) : mix(c2, c3, (t - 0.5) * 2.0);
    float intensity = sin(t * 3.14159); float alpha = t * t;
    vec3 finalColor = mix(fireColor * intensity, img.rgb, alpha);
    float finalAlpha = mix(intensity, img.a, alpha);
    finalColor += fireColor * (1.0 - alpha) * 0.28;
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
}
`

// Mobile: 1-octave FBM — compiles ~3x faster on Adreno/Mali GPUs, same visual effect
const FRAG_MOBILE = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform float u_burn;
uniform float u_time;
uniform float u_aspect;
uniform float u_image_aspect;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 st) {
  return noise(st);
}

void main() {
  float baseLine = u_burn;
  vec2 nc = vec2(v_uv.x * u_aspect * 3.5 + u_time * 0.035, v_uv.y * 7.0 + u_time * 0.22);
  float edgeNoise = fbm(nc);
  float mainEdge = baseLine + (edgeNoise - 0.5) * 0.18;
  vec2 tc = vec2(v_uv.x * u_aspect * 7.0 + u_time * 0.018, v_uv.y * 4.0 + 100.0);
  float thickNoise = fbm(tc);
  float localThickness = mix(0.008, 0.055, thickNoise);
  float lower = mainEdge - localThickness * 0.4;
  float upper = mainEdge + localThickness * 0.6;
  float ratio = u_aspect / u_image_aspect;
  vec2 coverUV = vec2(0.5 + (v_uv.x - 0.5) * min(ratio, 1.0), 0.5 + (v_uv.y - 0.5) * min(1.0 / ratio, 1.0));
  vec4 img = texture2D(u_image, coverUV);
  if (v_uv.y < lower) {
    gl_FragColor = vec4(0.0);
  } else if (v_uv.y > upper) {
    float nearEdge = smoothstep(upper + localThickness * 3.0, upper, v_uv.y);
    vec3 edgeGlow = vec3(1.0, 0.38, 0.0) * nearEdge * 0.45;
    gl_FragColor = vec4(img.rgb + edgeGlow, img.a);
  } else {
    float t = (v_uv.y - lower) / (upper - lower);
    vec3 c1 = vec3(0.78, 0.05, 0.0); vec3 c2 = vec3(1.0, 0.34, 0.0); vec3 c3 = vec3(1.0, 0.82, 0.22);
    vec3 fireColor = t < 0.5 ? mix(c1, c2, t * 2.0) : mix(c2, c3, (t - 0.5) * 2.0);
    float intensity = sin(t * 3.14159); float alpha = t * t;
    vec3 finalColor = mix(fireColor * intensity, img.rgb, alpha);
    float finalAlpha = mix(intensity, img.a, alpha);
    finalColor += fireColor * (1.0 - alpha) * 0.28;
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
}
`

// ── Helpers ────────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? 'shader compile error')
  }
  return s
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram {
  const p = gl.createProgram()!
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert))
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? 'program link error')
  }
  return p
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  burnProgressRef: React.RefObject<number>
  maxDpr?: number
  maxFps?: number
}

export function PainBurnCanvas({ burnProgressRef, maxDpr, maxFps }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    let raf = 0
    let ro: ResizeObserver | null = null
    let io: IntersectionObserver | null = null
    let buf: WebGLBuffer | null = null
    let tex: WebGLTexture | null = null
    let prog: WebGLProgram | null = null
    let rICId = 0

    type RIC = (cb: () => void, opts?: { timeout: number }) => number
    const rIC: RIC = (window as any).requestIdleCallback
      ?? ((cb: () => void) => setTimeout(cb, 400) as unknown as number)
    const cancelRIC: (id: number) => void =
      (window as any).cancelIdleCallback ?? clearTimeout

    // ── Texture: placeholder until IO triggers load ──
    tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))

    const img = new Image()
    img.crossOrigin = 'anonymous'

    // ── Resize ──
    function resize() {
      const dpr = maxDpr ? Math.min(window.devicePixelRatio, maxDpr) : window.devicePixelRatio
      const w = Math.round(canvas!.clientWidth * dpr)
      const h = Math.round(canvas!.clientHeight * dpr)
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
        gl!.viewport(0, 0, w, h)
      }
    }
    resize()
    ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── RAF loop — runs immediately, draws only after prog is ready ──
    let visible = false
    let startTime = performance.now()
    let lastDraw = 0
    const frameInterval = maxFps ? 1000 / maxFps : 0

    function render() {
      raf = requestAnimationFrame(render)
      if (!prog || !visible) return

      const now = performance.now()
      if (frameInterval > 0 && now - lastDraw < frameInterval) return
      lastDraw = now

      resize()

      const t = (now - startTime) / 1000
      const burn = burnProgressRef.current ?? 0

      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.uniform1f(gl!.getUniformLocation(prog!, 'u_burn'), burn)
      gl!.uniform1f(gl!.getUniformLocation(prog!, 'u_time'), t)
      gl!.uniform1f(gl!.getUniformLocation(prog!, 'u_aspect'), canvas!.width / canvas!.height)
      gl!.uniform1i(gl!.getUniformLocation(prog!, 'u_image'), 0)
      gl!.activeTexture(gl!.TEXTURE0)
      gl!.bindTexture(gl!.TEXTURE_2D, tex!)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    }
    render()

    // ── IntersectionObserver: defers ALL heavy work until user scrolls near section ──
    // Shader compilation only starts when section is 400px away — by then the
    // hero JS is already loaded and the main thread is free.
    let started = false

    io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting

      if (entry.isIntersecting && !started) {
        started = true

        // Start texture download
        img.onload = () => {
          if (!tex) return
          gl!.bindTexture(gl!.TEXTURE_2D, tex!)
          gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true)
          gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img)
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
        }
        img.src = '/pain-image.png'

        // Compile shader in idle time — mobile gets the simplified 1-octave version
        const isMobile = window.innerWidth < 768
        const fragSrc = isMobile ? FRAG_MOBILE : FRAG

        rICId = rIC(() => {
          try {
            prog = createProgram(gl, VERT, fragSrc)
          } catch (e) {
            console.warn('PainBurnCanvas shader error:', e)
            return
          }
          gl.useProgram(prog)

          buf = gl.createBuffer()!
          gl.bindBuffer(gl.ARRAY_BUFFER, buf)
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
          const aPos = gl.getAttribLocation(prog, 'a_position')
          gl.enableVertexAttribArray(aPos)
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

          gl.uniform1f(gl.getUniformLocation(prog, 'u_image_aspect'), 16.0 / 9.0)

          gl.enable(gl.BLEND)
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
          gl.clearColor(0, 0, 0, 0)

          startTime = performance.now()
        }, { timeout: isMobile ? 600 : 1500 })
      }
    }, { rootMargin: '400px' })

    io.observe(canvas)

    return () => {
      cancelRIC(rICId)
      cancelAnimationFrame(raf)
      ro?.disconnect()
      io?.disconnect()
      if (tex)  gl.deleteTexture(tex)
      if (buf)  gl.deleteBuffer(buf)
      if (prog) gl.deleteProgram(prog)
    }
  }, [burnProgressRef, maxDpr, maxFps])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 2,
      }}
    />
  )
}
