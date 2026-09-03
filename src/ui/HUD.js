const Phaser = window.Phaser;

export class HUD {
  constructor(scene) {
    this.scene = scene;

    // Fixed UI container setScrollFactor(0)
    this.container = scene.add.container(0, 0).setScrollFactor(0).setDepth(500);

    this.createTopLeftPlayerBars();
    this.createTopCenterScore();
    this.createTopRightInfo();
    this.createBossBar();
  }

  createTopLeftPlayerBars() {
    // Player portrait card
    const cardBg = this.scene.add.rectangle(110, 45, 190, 65, 0x100c24, 0.85)
      .setStrokeStyle(2, 0x00f0ff);
    this.container.add(cardBg);

    const nameTxt = this.scene.add.text(25, 20, "SCOTT PILGRIM", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "#00f0ff"
    });
    this.container.add(nameTxt);

    // HP Bar
    const hpBg = this.scene.add.rectangle(115, 42, 140, 12, 0x330011);
    this.hpBar = this.scene.add.rectangle(45, 42, 140, 12, 0xff4757).setOrigin(0, 0.5);
    this.hpText = this.scene.add.text(115, 42, "100/100", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "9px",
      color: "#ffffff"
    }).setOrigin(0.5);
    this.container.add([hpBg, this.hpBar, this.hpText]);

    // Energy Bar
    const energyBg = this.scene.add.rectangle(115, 60, 140, 8, 0x002233);
    this.energyBar = this.scene.add.rectangle(45, 60, 140, 8, 0x00d2d3).setOrigin(0, 0.5);
    this.container.add([energyBg, this.energyBar]);
  }

  createTopCenterScore() {
    this.scoreText = this.scene.add.text(480, 25, "SCORE: 0", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#feca57",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);

    this.comboText = this.scene.add.text(480, 50, "", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ff0080",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);

    this.container.add([this.scoreText, this.comboText]);
  }

  createTopRightInfo() {
    const infoBg = this.scene.add.rectangle(850, 45, 170, 65, 0x100c24, 0.85)
      .setStrokeStyle(2, 0xfeca57);
    this.container.add(infoBg);

    this.coinsText = this.scene.add.text(775, 25, "🪙 COINS: 0", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px",
      color: "#feca57"
    });

    this.levelText = this.scene.add.text(775, 50, "STAGE: 1", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px",
      color: "#00f0ff"
    });

    this.container.add([this.coinsText, this.levelText]);
  }

  createBossBar() {
    this.bossContainer = this.scene.add.container(480, 95).setScrollFactor(0).setDepth(501).setVisible(false);

    this.bossNameText = this.scene.add.text(0, -22, "RIVAL", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ff4757",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);

    const bgBar = this.scene.add.rectangle(0, 0, 400, 16, 0x220000)
      .setStrokeStyle(2, 0xff4757);

    this.bossHpFill = this.scene.add.rectangle(-200, 0, 400, 16, 0xff0055).setOrigin(0, 0.5);

    this.bossHpText = this.scene.add.text(0, 0, "100%", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.bossContainer.add([this.bossNameText, bgBar, this.bossHpFill, this.bossHpText]);
  }

  showBossBar(name, health, maxHealth) {
    this.bossNameText.setText(name);
    this.updateBossHealth(health, maxHealth);
    this.bossContainer.setVisible(true);
  }

  hideBossBar() {
    this.bossContainer.setVisible(false);
  }

  updateBossHealth(health, maxHealth) {
    const ratio = Math.max(0, health / maxHealth);
    this.bossHpFill.setSize(Math.round(400 * ratio), 16);
    this.bossHpText.setText(`${Math.ceil(ratio * 100)}%`);
  }

  updateBars(stats) {
    const hpRatio = Math.max(0, stats.health / stats.maxHealth);
    this.hpBar.setSize(Math.round(140 * hpRatio), 12);
    this.hpText.setText(`${Math.max(0, stats.health)}/${stats.maxHealth}`);

    const energyRatio = Math.max(0, stats.energy / stats.maxEnergy);
    this.energyBar.setSize(Math.round(140 * energyRatio), 8);
  }

  updateTopInfo(stats) {
    this.scoreText.setText(`SCORE: ${stats.score}`);
    this.coinsText.setText(`🪙 COINS: ${stats.coins}`);
  }

  updateCombo(count, mult) {
    if (count <= 0) {
      this.comboText.setText("");
    } else {
      this.comboText.setText(`${count} HIT COMBO! (${mult}x)`);
    }
  }

  updateStageLevel(level) {
    this.levelText.setText(`STAGE: ${level}`);
  }

  glitchEffect() {
    this.scene.tweens.add({
      targets: this.container,
      x: () => Phaser.Math.Between(-15, 15),
      y: () => Phaser.Math.Between(-15, 15),
      duration: 50,
      repeat: 6,
      yoyo: true,
      onComplete: () => {
        this.container.setPosition(0, 0);
      }
    });
  }
}
