import { TextureGenerator } from '../systems/TextureGenerator.js';

const Phaser = window.Phaser;

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Show loading text
    // Load character and boss assets

    this.load.image('alex_ryder', 'assets/scottttttttttttt.png');
    this.load.image('ramona_flowers', 'assets/ramona.png');
    this.load.image('gideon_graves', 'assets/gideon.png');
    this.load.image('katayanagi_twins', 'assets/kylenken.png');
    this.load.image('lucas_lee', 'assets/lucas.png');
    this.load.image('matthew_patel', 'assets/matthew.png');
    this.load.image('roxie_richter', 'assets/roxie.png');
    this.load.image('todd_ingram', 'assets/todd.png');
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
