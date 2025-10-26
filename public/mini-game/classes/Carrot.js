/* eslint-disable */
class Carrot {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.collected = false;
    this.isImageLoaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.isImageLoaded = true;
    };
    this.image.src = './images/7e2e3c22-9b0f-41e7-d384-57264cf2c700.png';

    // Animation properties
    this.elapsedTime = 0;
    this.currentFrame = 0;
    this.totalFrames = 1; // Assuming 4 frames for carrot animation
    this.frameWidth = 16;
    this.frameHeight = 16;
  }

  draw(c) {
    if (!this.collected && this.isImageLoaded) {
      // Calculate source coordinates for carrot sprite (adjust based on your tileset)
      const srcX = this.currentFrame * this.frameWidth;
      const srcY = 0; // Adjust this based on where carrots are in your tileset

      c.drawImage(
        this.image,
        srcX,
        srcY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
  }

  update(deltaTime) {
    if (!this.collected) {
      // Update animation
      this.elapsedTime += deltaTime;
      if (this.elapsedTime > 0.2) {
        // Slower animation for carrots
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        this.elapsedTime -= 0.2;
      }
    }
  }

  checkCollision(player) {
    if (this.collected) return false;

    return (
      player.hitbox.x < this.x + this.width &&
      player.hitbox.x + player.hitbox.width > this.x &&
      player.hitbox.y < this.y + this.height &&
      player.hitbox.y + player.hitbox.height > this.y
    );
  }

  collect() {
    this.collected = true;
    // You can add collection effects here
    console.log('Carrot collected!');
  }
}
