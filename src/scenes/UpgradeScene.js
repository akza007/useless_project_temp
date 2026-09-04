import { SaveSystem } from '../systems/SaveSystem.js';
import { UPGRADE_CONFIG } from '../data/playerData.js';
import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create() {
    this.saveData = SaveSystem.loadGame();
    this.add.image(480, 270, 'bg_parallax_city');

    this.add.text(480, 50, "UPGRADE SHOP", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "28px",
      color: "#feca57",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    this.coinsText = this.add.text(480, 85, `COINS: ${this.saveData.coins}`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#00f0ff"
    }).setOrigin(0.5);

    this.renderUpgrades();

    const nextStage = Math.min(7, (this.saveData.currentLevel || 1));
    const startBtn = this.add.text(480, 465, `[ START STAGE ${nextStage} ]`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "15px",
      color: "#00f0ff",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.start('LevelScene', { stage: nextStage });
    });

    const backBtn = this.add.text(480, 505, "[ BACK TO MENU ]", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px",
      color: "#aaaaaa"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      audioManager.playCoin();
      this.scene.start('MenuScene');
    });
  }

  renderUpgrades() {
    if (this.upgradeContainer) this.upgradeContainer.destroy();
    this.upgradeContainer = this.add.container(0, 0);

    const keys = Object.keys(UPGRADE_CONFIG);
    keys.forEach((statKey, idx) => {
      const cfg = UPGRADE_CONFIG[statKey];
      const level = this.saveData.upgrades[statKey] || 0;
      const currentCost = Math.round(cfg.cost * Math.pow(cfg.costMult, level));

      const y = 130 + idx * 55;
      const bg = this.add.rectangle(480, y, 640, 45, 0x100c24, 0.9)
        .setStrokeStyle(2, 0x00f0ff);

      const val = this.saveData.playerStats[statKey];
      const txt = this.add.text(180, y - 8, `${cfg.name} (LVL ${level}): ${val}`, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "10px",
        color: "#ffffff"
      });

      const buyBtn = this.add.text(680, y - 8, `BUY (${currentCost} C)`, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "10px",
        color: this.saveData.coins >= currentCost ? "#feca57" : "#777777"
      }).setInteractive({ useHandCursor: this.saveData.coins >= currentCost });

      buyBtn.on('pointerdown', () => {
        if (this.saveData.coins >= currentCost) {
          this.saveData.coins -= currentCost;
          this.saveData.upgrades[statKey] = level + 1;
          this.saveData.playerStats[statKey] += cfg.increment;

          if (statKey === 'maxHealth') {
            this.saveData.playerStats.health = this.saveData.playerStats.maxHealth;
          }

          SaveSystem.saveGame(this.saveData);
          audioManager.playHealth();
          this.coinsText.setText(`COINS: ${this.saveData.coins}`);
          this.renderUpgrades();
        }
      });

      this.upgradeContainer.add([bg, txt, buyBtn]);
    });
  }
}
