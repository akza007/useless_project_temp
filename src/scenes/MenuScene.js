import { SaveSystem } from '../systems/SaveSystem.js';
import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.saveData = SaveSystem.loadGame();

    // Background texture
    this.add.image(480, 270, 'bg_parallax_city');

    // Title
    const titleText = this.add.text(480, 100, "RIVAL RUSH", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "44px",
      color: "#00f0ff",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5);

    const subTitle = this.add.text(480, 150, "RISE OF THE SEVEN", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "20px",
      color: "#ff0080",
      stroke: "#000000",
      strokeThickness: 5
    }).setOrigin(0.5);

    // Glowing animation for title
    this.tweens.add({
      targets: titleText,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    const options = [
      { text: "START GAME", action: () => this.scene.start('LevelScene', { stage: this.saveData.currentLevel }) },
      { text: "CHARACTER", action: () => this.scene.start('CharacterSelectScene') },
      { text: "UPGRADES", action: () => this.scene.start('UpgradeScene') },
      { text: "HOW TO PLAY", action: () => this.showHowToPlay() },
      { text: "RESET PROGRESS", action: () => this.resetProgress() }
    ];

    options.forEach((opt, idx) => {
      const btn = this.add.text(480, 240 + idx * 50, opt.text, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        btn.setStyle({ color: "#feca57" });
        btn.setScale(1.1);
        audioManager.playPunch();
      });

      btn.on('pointerout', () => {
        btn.setStyle({ color: "#ffffff" });
        btn.setScale(1.0);
      });

      btn.on('pointerdown', () => {
        audioManager.playCoin();
        opt.action();
      });
    });

    audioManager.startBGM('stage');
  }

  showHowToPlay() {
    const dialogBg = this.add.rectangle(480, 270, 700, 360, 0x100c24, 0.95)
      .setStrokeStyle(4, 0x00f0ff).setDepth(200);

    const txt = this.add.text(480, 260,
      "CONTROLS:\n\n" +
      "WASD / ARROWS : MOVE & JUMP\n" +
      "SPACE         : BASIC ATTACK\n" +
      "J             : HEAVY ATTACK\n" +
      "K             : SPECIAL ATTACK\n" +
      "L             : DASH (I-FRAMES)\n" +
      "ESC           : PAUSE\n\n" +
      "DEFEAT ALL 7 RIVALS TO WIN!", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "13px",
        color: "#ffffff",
        align: "center",
        lineSpacing: 10
      }).setOrigin(0.5).setDepth(201);

    const closeBtn = this.add.text(480, 410, "[ CLOSE ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ff4757"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(202);

    closeBtn.on('pointerdown', () => {
      dialogBg.destroy();
      txt.destroy();
      closeBtn.destroy();
    });
  }

  resetProgress() {
    SaveSystem.resetSave();
    this.saveData = SaveSystem.loadGame();
    const alertTxt = this.add.text(480, 490, "PROGRESS RESET!", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "#ff4757"
    }).setOrigin(0.5);
    this.time.delayedCall(1500, () => alertTxt.destroy());
  }
}
