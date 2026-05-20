import { useEffect, useRef, useState } from "react";

/**
 * Pixel mini-game: descend a building, collect coins (+10), avoid windows/AC
 * units (-1 life). Controls: Arrow keys / A·D / tap & hold left/right edges.
 * The world is a fixed-size pixel canvas scaled responsively (image-rendering:
 * pixelated). Game loop runs in rAF and only React-renders for score/lives/UI.
 */

const W = 160; // pixel width
const H = 240; // pixel height
const SCALE = 2; // base scale (CSS upscales further)

type Coin = { x: number; y: number; taken: boolean };
type Obstacle = { x: number; y: number; w: number; h: number; type: "window" | "ac" };

type GameState = {
  playerX: number;
  playerY: number;
  vy: number;
  scrollY: number; // how far we've descended
  coins: Coin[];
  obstacles: Obstacle[];
  score: number;
  lives: number;
  invuln: number;
  over: boolean;
  won: boolean;
  frame: number;
};

const TARGET_DEPTH = 1200; // total descent to "win"

function makeWorld(): GameState {
  const rng = mulberry32(42);
  const coins: Coin[] = [];
  const obstacles: Obstacle[] = [];
  // Generate in bands every 30px
  for (let y = 60; y < TARGET_DEPTH + H; y += 28) {
    const r = rng();
    if (r < 0.55) {
      // place 1-3 coins on a row
      const count = 1 + Math.floor(rng() * 3);
      for (let i = 0; i < count; i++) {
        coins.push({ x: 20 + Math.floor(rng() * (W - 40)), y, taken: false });
      }
    }
    if (r > 0.35) {
      const type: "window" | "ac" = rng() < 0.5 ? "window" : "ac";
      const w = type === "window" ? 26 : 18;
      const h = type === "window" ? 22 : 12;
      obstacles.push({ x: 10 + Math.floor(rng() * (W - 20 - w)), y: y + 10, w, h, type });
    }
  }
  return {
    playerX: W / 2 - 4,
    playerY: 20,
    vy: 0,
    scrollY: 0,
    coins,
    obstacles,
    score: 0,
    lives: 3,
    invuln: 0,
    over: false,
    won: false,
    frame: 0,
  };
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Phase = "intro" | "play" | "end";

export function RappelGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(makeWorld());
  const keysRef = useRef<{ left: boolean; right: boolean; down: boolean }>({
    left: false,
    right: false,
    down: false,
  });
  const rafRef = useRef<number | null>(null);
  const totalCoinsRef = useRef<number>(stateRef.current.coins.length);
  const [, force] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");

  // Render UI counters at ~10fps while playing
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => force((v) => v + 1), 100);
    return () => clearInterval(id);
  }, [phase]);

  // Input
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = down;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = down;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keysRef.current.down = down;
      if (down && e.key === "Escape") onClose();
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [onClose]);

  // Game loop — only runs during play
  useEffect(() => {
    if (phase !== "play") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(33, now - last) / 16.6667;
      last = now;
      step(dt);
      draw(ctx);
      const s = stateRef.current;
      if (s.over || s.won) {
        setPhase("end");
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  const step = (dt: number) => {
    const s = stateRef.current;
    s.frame++;
    const speed = 1.5 * dt;
    if (keysRef.current.left) s.playerX -= speed * 1.5;
    if (keysRef.current.right) s.playerX += speed * 1.5;
    const descend = (keysRef.current.down ? 1.8 : 1.0) * dt;
    s.scrollY += descend;
    if (s.invuln > 0) s.invuln -= dt;
    if (s.playerX < 4) s.playerX = 4;
    if (s.playerX > W - 12) s.playerX = W - 12;
    const px = s.playerX;
    const py = s.playerY + s.scrollY;
    for (const c of s.coins) {
      if (c.taken) continue;
      if (Math.abs(c.x + 3 - (px + 4)) < 6 && Math.abs(c.y + 3 - (py + 5)) < 7) {
        c.taken = true;
        s.score += 10;
      }
    }
    if (s.invuln <= 0) {
      for (const o of s.obstacles) {
        if (px + 8 > o.x && px < o.x + o.w && py + 10 > o.y && py < o.y + o.h) {
          s.lives -= 1;
          s.invuln = 60;
          if (s.lives <= 0) s.over = true;
          break;
        }
      }
    }
    if (s.scrollY >= TARGET_DEPTH) s.won = true;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current;
    ctx.fillStyle = "#0F1B3D";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1a2750";
    const off = Math.floor(s.scrollY) % 16;
    for (let y = -off; y < H; y += 16) {
      for (let x = (Math.floor(y / 16) % 2) * 12; x < W; x += 24) {
        ctx.fillRect(x, y, 22, 14);
      }
    }
    ctx.fillStyle = "#F5C500";
    const ropeX = Math.floor(s.playerX + 4);
    for (let y = 0; y < s.playerY + 10; y += 4) {
      ctx.fillRect(ropeX, y, 1, 2);
    }
    for (const o of s.obstacles) {
      const oy = o.y - s.scrollY;
      if (oy < -20 || oy > H) continue;
      if (o.type === "window") {
        ctx.fillStyle = "#3a4a78";
        ctx.fillRect(o.x, oy, o.w, o.h);
        ctx.fillStyle = "#8fb8d9";
        ctx.fillRect(o.x + 2, oy + 2, o.w - 4, o.h - 4);
        ctx.fillStyle = "#3a4a78";
        ctx.fillRect(o.x + o.w / 2 - 1, oy + 2, 2, o.h - 4);
        ctx.fillRect(o.x + 2, oy + o.h / 2 - 1, o.w - 4, 2);
      } else {
        ctx.fillStyle = "#888";
        ctx.fillRect(o.x, oy, o.w, o.h);
        ctx.fillStyle = "#555";
        ctx.fillRect(o.x + 2, oy + 2, o.w - 4, 3);
        ctx.fillRect(o.x + 2, oy + 7, o.w - 4, 3);
      }
    }
    for (const c of s.coins) {
      if (c.taken) continue;
      const cy = c.y - s.scrollY;
      if (cy < -10 || cy > H) continue;
      const spin = Math.floor(s.frame / 8) % 4;
      ctx.fillStyle = "#F5C500";
      if (spin === 0 || spin === 2) {
        ctx.fillRect(c.x, cy, 6, 6);
        ctx.fillStyle = "#fff7c2";
        ctx.fillRect(c.x + 1, cy + 1, 2, 2);
      } else {
        ctx.fillRect(c.x + 2, cy, 2, 6);
      }
    }
    const blink = s.invuln > 0 && Math.floor(s.frame / 4) % 2 === 0;
    if (!blink) {
      const px = Math.floor(s.playerX);
      const py = s.playerY;
      ctx.fillStyle = "#F5C500";
      ctx.fillRect(px + 1, py, 6, 2);
      ctx.fillRect(px, py + 1, 8, 1);
      ctx.fillStyle = "#E8B894";
      ctx.fillRect(px + 2, py + 2, 4, 2);
      ctx.fillStyle = "#0F1B3D";
      ctx.fillRect(px + 1, py + 4, 6, 4);
      ctx.fillStyle = "#fff";
      ctx.fillRect(px + 2, py + 5, 4, 1);
      ctx.fillStyle = "#0F1B3D";
      const legFrame = Math.floor(s.frame / 6) % 2;
      if (legFrame === 0) {
        ctx.fillRect(px + 1, py + 8, 2, 2);
        ctx.fillRect(px + 5, py + 8, 2, 2);
      } else {
        ctx.fillRect(px + 2, py + 8, 2, 2);
        ctx.fillRect(px + 4, py + 8, 2, 2);
      }
    }
  };

  const restart = () => {
    stateRef.current = makeWorld();
    totalCoinsRef.current = stateRef.current.coins.length;
    keysRef.current.left = false;
    keysRef.current.right = false;
    keysRef.current.down = false;
    setPhase("play");
  };

  // Touch zone helpers — bind both touch & mouse for desktop testing
  const bind = (key: "left" | "right" | "down") => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      keysRef.current[key] = true;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      keysRef.current[key] = false;
    },
    onTouchCancel: () => (keysRef.current[key] = false),
    onMouseDown: () => (keysRef.current[key] = true),
    onMouseUp: () => (keysRef.current[key] = false),
    onMouseLeave: () => (keysRef.current[key] = false),
  });

  const s = stateRef.current;
  const total = totalCoinsRef.current;
  const coinsCollected = s.coins.filter((c) => c.taken).length;
  const progress = Math.min(100, Math.floor((s.scrollY / TARGET_DEPTH) * 100));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-md border-2 border-[#F5C500]/60 bg-[#0a1230] p-4 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white">
            <span className="text-[#F5C500]">★ {s.score}</span>
            <span>♥ {s.lives}</span>
            <span className="text-white/60">{progress}%</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm border border-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10"
          >
            X
          </button>
        </div>

        <div className="relative mx-auto select-none" style={{ width: W * SCALE, maxWidth: "100%" }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{
              width: "100%",
              height: "auto",
              imageRendering: "pixelated",
              display: "block",
              background: "#0F1B3D",
              border: "1px solid rgba(245,197,0,0.3)",
              touchAction: "none",
            }}
          />

          {/* Touch zones — visible, subtle */}
          {phase === "play" && (
            <div className="absolute inset-0 grid grid-cols-3 md:hidden">
              <button
                aria-label="Izquierda"
                className="flex items-end justify-center pb-3 bg-gradient-to-r from-white/10 to-transparent text-white/70 active:bg-white/20"
                {...bind("left")}
              >
                <span className="font-mono text-xl leading-none">◀</span>
              </button>
              <button
                aria-label="Bajar rápido"
                className="flex items-end justify-center pb-3 text-[#F5C500]/80 active:bg-[#F5C500]/15"
                {...bind("down")}
              >
                <span className="font-mono text-xl leading-none">▼</span>
              </button>
              <button
                aria-label="Derecha"
                className="flex items-end justify-center pb-3 bg-gradient-to-l from-white/10 to-transparent text-white/70 active:bg-white/20"
                {...bind("right")}
              >
                <span className="font-mono text-xl leading-none">▶</span>
              </button>
            </div>
          )}

          {/* Intro / tutorial overlay */}
          {phase === "intro" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 text-center font-mono text-white">
              <div className="text-[#F5C500] text-base font-bold uppercase tracking-widest">
                Rappel Run
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-wider text-white/80">
                Baja del edificio.<br />
                Recolecta monedas. Esquiva ventanas y A/C.
              </p>
              <div className="mt-4 space-y-1 text-[9px] uppercase tracking-widest text-white/60">
                <div>◀ ▶ mover · ▼ bajar rápido</div>
                <div className="text-white/40">teclado: ← → ↓ · móvil: toca zonas</div>
              </div>
              <button
                onClick={() => setPhase("play")}
                className="mt-5 rounded-sm bg-[#F5C500] px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1230] hover:bg-white"
              >
                ▶ Empezar
              </button>
            </div>
          )}

          {/* End screen with summary */}
          {phase === "end" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 text-center font-mono text-white">
              <div
                className={`text-base font-bold uppercase tracking-widest ${
                  s.won ? "text-[#F5C500]" : "text-white"
                }`}
              >
                {s.won ? "¡Misión cumplida!" : "Game Over"}
              </div>
              <div className="mt-4 w-full max-w-[200px] space-y-1.5 text-[10px] uppercase tracking-widest">
                <Row label="Puntos" value={`★ ${s.score}`} accent />
                <Row label="Monedas" value={`${coinsCollected} / ${total}`} />
                <Row label="Vidas" value={"♥".repeat(Math.max(0, s.lives)) || "—"} />
                <Row label="Progreso" value={`${progress}%`} />
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={restart}
                  className="rounded-sm bg-[#F5C500] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1230] hover:bg-white"
                >
                  Volver a jugar
                </button>
                <button
                  onClick={onClose}
                  className="rounded-sm border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10"
                >
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-widest text-white/50">
          ← → mover · ↓ rápido · esc cerrar
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-1">
      <span className="text-white/50">{label}</span>
      <span className={accent ? "text-[#F5C500]" : "text-white"}>{value}</span>
    </div>
  );
}
