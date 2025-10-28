// touchControls.js
class TouchControls {
  constructor(keys) {
    this.keys = keys;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    if (this.isMobile) {
      this.initTouchControls();
    }
  }

  initTouchControls() {
    // Movement buttons
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');

    // Left button
    this.setupButton(
      leftBtn,
      () => {
        this.keys.a.pressed = true;
      },
      () => {
        this.keys.a.pressed = false;
      },
    );

    // Right button
    this.setupButton(
      rightBtn,
      () => {
        this.keys.d.pressed = true;
      },
      () => {
        this.keys.d.pressed = false;
      },
    );

    // Up button (jump)
    this.setupButton(
      upBtn,
      () => {
        if (!this.keys.w.pressed) {
          if (player) {
            player.jump();
          }
        }
        this.keys.w.pressed = true;
      },
      () => {
        this.keys.w.pressed = false;
      },
    );

    // Down button (action - convert carrots to coins)
    this.setupButton(
      downBtn,
      () => {
        this.keys.x.pressed = true;
        if (typeof convertCarrotsToCoin === 'function') {
          convertCarrotsToCoin();
        }
      },
      () => {
        this.keys.x.pressed = false;
      },
    );

    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
      if (this.isMobile) e.preventDefault();
    });

    // Prevent default touch behaviors
    document.addEventListener(
      'touchmove',
      (e) => {
        if (this.isMobile && e.target.id !== 'touch-controls') {
          e.preventDefault();
        }
      },
      { passive: false },
    );

    console.log('Touch controls initialized');
  }

  setupButton(button, onStart, onEnd) {
    if (!button) return;

    // Touch events
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onStart();
    });

    button.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onEnd();
    });

    button.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onEnd();
    });

    // Mouse events for testing on desktop
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart();
    });

    button.addEventListener('mouseup', (e) => {
      e.preventDefault();
      onEnd();
    });

    button.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      onEnd();
    });
  }
}
