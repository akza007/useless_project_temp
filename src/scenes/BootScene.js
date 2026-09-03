import { TextureGenerator } from '../systems/TextureGenerator.js';

const Phaser = window.Phaser;

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Show loading text
    this.add.text(480, 270, "GENERATING RETRO ARCADE ASSETS...", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#00f0ff"
    }).setOrigin(0.5);
  }

  create() {
    // Generate procedural pixel art textures
    TextureGenerator.generateAll(this);

    this.time.delayedCall(300, () => {
      this.scene.start('MenuScene');
    });
  }
}
