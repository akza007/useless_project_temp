import { audioManager } from '../systems/AudioManager.js';
import { SaveSystem } from '../systems/SaveSystem.js';

const Phaser = window.Phaser;

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.currentLevel = data.level || 1;
  }

  create() {
    this.add.rectangle(480, 270, 960, 540, 0x080711, 0.95);

    this.add.text(480, 140, "GAME OVER", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "44px",
      color: "#ff4757",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(480, 230, `FINAL SCORE: ${this.finalScore}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#feca57"
    }).setOrigin(0.5);

    this.add.text(480, 270, `RIVALS DEFEATED: ${Math.max(0, this.currentLevel - 1)} / 7`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#00f0ff"
    }).setOrigin(0.5);

    const retryBtn = this.add.text(480, 360, "[ RESTART FROM STAGE 1 ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#00f0ff",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerdown', () => {
      audioManager.playCoin();
      const saveData = SaveSystem.loadGame();
      saveData.currentLevel = 1;
      SaveSystem.saveGame(saveData);
      this.scene.start('LevelScene', { stage: 1 });
    });

    const menuBtn = this.add.text(480, 420, "[ MAIN MENU ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#aaaaaa"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.start('MenuScene');
    });
  }
}
