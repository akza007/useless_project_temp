import { SaveSystem } from '../systems/SaveSystem.js';
import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create() {
    this.saveData = SaveSystem.loadGame();
    const stats = this.saveData.playerStats;

    this.add.image(480, 270, 'bg_parallax_city');

    this.add.text(480, 45, "CHARACTER SELECT", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "26px",
      color: "#00f0ff",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    // Scott Card Box
    const scottCard = this.add.rectangle(300, 230, 360, 240, 0x100c24, 0.9)
      .setStrokeStyle(3, 0x00f0ff);

    this.add.sprite(180, 230, 'alex_ryder', 0).setScale(2.5);

    this.add.text(260, 130, "SCOTT PILGRIM", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#feca57"
    });

    this.add.text(260, 160, "Playable Protagonist", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "9px",
      color: "#ffffff"
    });

    this.add.text(260, 190, `ATTACK: ${stats.attackDamage}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ff4757"
    });

    this.add.text(260, 215, `SPEED:  ${stats.speed}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#00d2d3"
    });

    this.add.text(260, 240, `HEALTH: ${stats.maxHealth}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#2ecc71"
    });

    // Ramona Partner Card Box
    const ramonaCard = this.add.rectangle(680, 230, 340, 240, 0x100c24, 0.9)
      .setStrokeStyle(3, 0xff0080);

    this.add.sprite(560, 230, 'ramona_flowers').setScale(2.5);

    this.add.text(640, 130, "RAMONA FLOWERS", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ff0080"
    });

    this.add.text(640, 165, "Story Partner\n\nDefeat the 7 Rivals\nto be together!", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "9px",
      color: "#ffffff",
      lineSpacing: 6
    });

    // START GAME BUTTON
    const startBtn = this.add.text(480, 390, "[ SELECT & START STAGE 1 ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#00f0ff",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => {
      startBtn.setStyle({ color: "#feca57" });
      startBtn.setScale(1.05);
    });

    startBtn.on('pointerout', () => {
      startBtn.setStyle({ color: "#00f0ff" });
      startBtn.setScale(1.0);
    });

    startBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.start('LevelScene', { stage: 1 });
    });

    // Back Button
    const backBtn = this.add.text(480, 460, "[ BACK TO MENU ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "#aaaaaa"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.start('MenuScene');
    });
  }
}
