import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#F97316', '#3B82F6', '#6366F1']
    });
  } catch (e) {
    // Canvas confetti fallback
  }
};

export const triggerTierUnlockCelebration = () => {
  try {
    const end = Date.now() + 1.2 * 1000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#10B981', '#34D399', '#FBBF24']
      });
    }, 200);
  } catch (e) {
    // Fallback
  }
};
