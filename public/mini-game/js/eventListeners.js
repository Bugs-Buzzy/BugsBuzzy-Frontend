// Initialize touch controls
touchControls = new TouchControls(keys);

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
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
    lastTime = performance.now();
    // Reset all keys when tab becomes visible again
    keys.w.pressed = false;
    keys.a.pressed = false;
    keys.d.pressed = false;
    keys.x.pressed = false;
  }
});

// Handle window blur (when user switches tabs or
