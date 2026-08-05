import confetti from "canvas-confetti";

const COLORS = ["#1E824C", "#FF5A3C", "#F4B740", "#1A1614", "#FBF3E4"];

/** A celebratory two-cannon burst for the champion reveal. */
export function fireChampionConfetti(): void {
  const end = Date.now() + 1400;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 62,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
      scalar: 1.1,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 62,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
      scalar: 1.1,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
    colors: COLORS,
  });
}

/** A small pop when a pick is made. */
export function firePickPop(x: number, y: number): void {
  confetti({
    particleCount: 18,
    spread: 55,
    startVelocity: 28,
    ticks: 60,
    origin: { x, y },
    colors: COLORS,
    scalar: 0.8,
  });
}
