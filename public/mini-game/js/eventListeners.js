// Initialize touch controls
if (typeof TouchControls !== 'undefined') {
  touchControls = new TouchControls(keys);
}

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
  // Only handle keyboard if not on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  if (isMobile) return;

  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      if (!keys.w.pressed) {
        player.jump();
      }
      keys.w.pressed = true;
      break;
    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = true;
      break;
    case 'd':
    case 'ArrowRight':
      keys.d.pressed = true;
      break;
    case 'x':
      convertCarrotsToCoin();
      keys.x.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  if (isMobile) return;

  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.w.pressed = false;
      break;
    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = false;
      break;
    case 'd':
    case 'ArrowRight':
      keys.d.pressed = false;
      break;
    case 'x':
      keys.x.pressed = false;
      break;
  }
});

// Handle window focus changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    if (typeof lastTime !== 'undefined') {
      lastTime = performance.now();
    }
    // Reset all keys when tab becomes visible again
    keys.w.pressed = false;
    keys.a.pressed = false;
    keys.d.pressed = false;
    keys.x.pressed = false;
  }
});

// Handle window blur (when user switches tabs)
