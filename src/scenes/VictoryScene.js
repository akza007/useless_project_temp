import { SaveSystem } from '../systems/SaveSystem.js';
import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.bossData = data.bossData;
    this.playerStats = data.playerStats;
  }

  create() {
    this.add.rectangle(480, 270, 960, 540, 0x080711, 0.95);

    const isFinalBoss = this.bossData.id === 7;

    const titleText = isFinalBoss ? "VICTORY!" : "RIVAL DEFEATED!";
    const color = isFinalBoss ? "#ff0080" : "#feca57";

    this.add.text(480, 80, titleText, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "36px",
      color: color,
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5);

    if (isFinalBoss) {
      this.add.text(480, 130, "THE SEVEN RIVALS HAVE FALLEN!", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "14px",
        color: "#00f0ff"
      }).setOrigin(0.5);

      // Render Scott Pilgrim & Ramona Flowers side-by-side!
      this.add.sprite(440, 200, 'alex_ryder', 0).setScale(2.5);
      this.add.sprite(520, 200, 'ramona_flowers').setScale(2.5);

      this.add.text(480, 250, "SCOTT & RAMONA REUNITED!", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "12px",
        color: "#ff0080"
      }).setOrigin(0.5);
    } else {
      this.add.text(480, 140, `Rival: ${this.bossData.name} - ${this.bossData.title}`, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "14px",
        color: "#00f0ff"
      }).setOrigin(0.5);
    }

    const card = this.add.rectangle(480, 340, 500, 150, 0x100c24, 0.9)
      .setStrokeStyle(2, 0x00f0ff);

    this.add.text(480, 300, `TOTAL SCORE: ${this.playerStats.score}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(480, 340, `XP EARNED: +${this.bossData.xpReward}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#2ecc71"
    }).setOrigin(0.5);

    this.add.text(480, 380, `COINS EARNED: +${this.bossData.coinReward}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#feca57"
    }).setOrigin(0.5);

    // Save Progress
    const saveData = SaveSystem.loadGame();
    saveData.score = this.playerStats.score;
    saveData.coins = this.playerStats.coins;
    saveData.xp = this.playerStats.xp;
    saveData.playerStats = this.playerStats;

    if (!saveData.defeatedRivals.includes(this.bossData.id)) {
      saveData.defeatedRivals.push(this.bossData.id);
    }

    if (this.bossData.id < 7) {
      saveData.currentLevel = Math.max(saveData.currentLevel, this.bossData.id + 1);
    }

    SaveSystem.saveGame(saveData);

    if (!isFinalBoss) {
      const nextStage = Math.min(7, this.bossData.id + 1);
      this.hasTransitioned = false;

      // Automatically transition to next stage after 2.5 seconds
      this.time.delayedCall(2500, () => {
        if (!this.hasTransitioned && this.sys && this.sys.settings.active) {
          this.hasTransitioned = true;
          this.scene.start('LevelScene', { stage: nextStage });
        }
      });

      const nextBtn = this.add.text(320, 460, `[ START STAGE ${nextStage} ]`, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "14px",
        color: "#00f0ff",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      nextBtn.on('pointerdown', () => {
        if (this.hasTransitioned) return;
        this.hasTransitioned = true;
        audioManager.playCoin();
        this.scene.start('LevelScene', { stage: nextStage });
      });

      const upgradeBtn = this.add.text(640, 460, "[ UPGRADE SHOP ]", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "14px",
        color: "#feca57",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      upgradeBtn.on('pointerdown', () => {
        if (this.hasTransitioned) return;
        this.hasTransitioned = true;
        audioManager.playCoin();
        this.scene.start('UpgradeScene');
      });
    } else {
      const menuBtn = this.add.text(480, 460, "[ RETURN TO MENU ]", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "14px",
        color: "#00f0ff",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      menuBtn.on('pointerdown', () => {
        audioManager.playCoin();
        this.scene.start('MenuScene');
      });
    }
  }
}
