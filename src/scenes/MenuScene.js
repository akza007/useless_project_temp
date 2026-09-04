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
      { text: "START GAME", action: () => this.scene.start('LevelScene', { stage: 1 }) },
      { text: "SELECT STAGE", action: () => this.showStageSelect() },
      { text: "CHARACTER", action: () => this.scene.start('CharacterSelectScene') },
      { text: "UPGRADES", action: () => this.scene.start('UpgradeScene') },
      { text: "HOW TO PLAY", action: () => this.showHowToPlay() },
      { text: "RESET PROGRESS", action: () => this.resetProgress() }
    ];

    options.forEach((opt, idx) => {
      const btn = this.add.text(480, 220 + idx * 45, opt.text, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "15px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        btn.setStyle({ color: "#feca57" });
        btn.setScale(1.08);
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

  showStageSelect() {
    const dialogBg = this.add.rectangle(480, 270, 720, 420, 0x100c24, 0.95)
      .setStrokeStyle(4, 0x00f0ff).setDepth(200);

    const title = this.add.text(480, 95, "SELECT STAGE / RIVAL", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "18px",
      color: "#00f0ff"
    }).setOrigin(0.5).setDepth(201);

    const maxUnlocked = Math.min(7, Math.max(1, this.saveData.currentLevel || 1));

    const stages = [
      { id: 1, name: "STAGE 1: MATTHEW PATEL (RIVAL 1)" },
      { id: 2, name: "STAGE 2: LUCAS LEE (RIVAL 2)" },
      { id: 3, name: "STAGE 3: ROXIE RICHTER (RIVAL 3)" },
      { id: 4, name: "STAGE 4: NEGA SCOTT (SHADOW RIVAL)" },
      { id: 5, name: "STAGE 5: KATAYANAGI TWINS (RIVAL 5)" },
      { id: 6, name: "STAGE 6: TODD INGRAM (RIVAL 6)" },
      { id: 7, name: "STAGE 7: GIDEON GRAVES (FINAL BOSS)" }
    ];

    const elements = [dialogBg, title];

    stages.forEach((stg, idx) => {
      const isUnlocked = stg.id <= maxUnlocked;
      const label = isUnlocked ? `[ ${stg.name} ]` : `[ ${stg.name} (LOCKED) ]`;
      const btn = this.add.text(480, 140 + idx * 42, label, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "10px",
        color: isUnlocked ? "#feca57" : "#555555"
      }).setOrigin(0.5).setDepth(201);

      if (isUnlocked) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => {
          audioManager.playCoin();
          this.scene.start('LevelScene', { stage: stg.id });
        });
      }
      elements.push(btn);
    });

    const closeBtn = this.add.text(480, 445, "[ CLOSE ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "#ff4757"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(201);

    closeBtn.on('pointerdown', () => {
      elements.forEach(el => el.destroy());
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
