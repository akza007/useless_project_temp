import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);

    this.add.text(480, 160, "PAUSED", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "36px",
      color: "#00f0ff",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    const resumeBtn = this.add.text(480, 250, "[ RESUME ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#ffffff"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    resumeBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.stop();
      this.scene.resume('LevelScene');
    });

    const restartBtn = this.add.text(480, 310, "[ RESTART ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#ffffff"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.stop();
      this.scene.stop('LevelScene');
      this.scene.start('LevelScene');
    });

    const menuBtn = this.add.text(480, 370, "[ MAIN MENU ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#aaaaaa"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.stop();
      this.scene.stop('LevelScene');
      this.scene.start('MenuScene');
    });
  }
}
