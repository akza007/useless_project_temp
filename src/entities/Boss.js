import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData.key, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.bossData = bossData;
    this.key = bossData.key;
    this.name = bossData.name;
    this.title = bossData.title;
    this.health = bossData.health;
    this.maxHealth = bossData.maxHealth;
    this.damage = bossData.damage;
    this.speed = bossData.speed;
    this.themeColor = bossData.themeColor;

    this.setScale(1.4);
    this.setCollideWorldBounds(true);
    this.setSize(36, 48);
    this.setOffset(14, 10);

    this.isAttacking = false;
    this.isHurt = false;
    this.isDead = false;
    this.isEnraged = false;
    this.attackCooldown = false;
    this.phase = 1;

    // Show warning & Dialogue when spawned
    this.triggerBossIntro();
  }

  triggerBossIntro() {
    audioManager.playWarning();
    this.scene.physics.world.pause();

    // Warning Banner
    const warningBg = this.scene.add.rectangle(480, 270, 960, 100, 0xff0033, 0.8)
      .setScrollFactor(0)
      .setDepth(100);

    const warningTxt = this.scene.add.text(480, 250, "WARNING!\nRIVAL APPROACHING", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "26px",
      color: "#ffffff",
      align: "center",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    this.scene.tweens.add({
      targets: [warningBg, warningTxt],
      alpha: { from: 1, to: 0.2 },
      duration: 200,
      yoyo: true,
      repeat: 4,
      onComplete: () => {
        warningBg.destroy();
        warningTxt.destroy();

        // Dialogue Box
        this.showDialogueBox();
      }
    });
  }

  showDialogueBox() {
    const dialogBg = this.scene.add.rectangle(480, 460, 800, 90, 0x100c24, 0.95)
      .setStrokeStyle(4, this.themeColor)
      .setScrollFactor(0)
      .setDepth(100);

    const nameTxt = this.scene.add.text(100, 430, `${this.name} - "${this.title}"`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "16px",
      color: "#00f0ff"
    }).setScrollFactor(0).setDepth(101);

    const speechTxt = this.scene.add.text(100, 460, `"${this.bossData.introDialogue}"`, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ffffff"
    }).setScrollFactor(0).setDepth(101);

    this.scene.time.delayedCall(2500, () => {
      dialogBg.destroy();
      nameTxt.destroy();
      speechTxt.destroy();

      if (this.scene && this.scene.physics) {
        this.scene.physics.world.resume();
      }
      if (this.scene.hud) {
        this.scene.hud.showBossBar(this.name, this.health, this.maxHealth);
      }
      audioManager.startBGM('boss');
    });
  }

  takeDamage(amount, attackerX) {
    if (this.isDead) return;

    this.health -= amount;
    if (this.scene.hud) {
      this.scene.hud.updateBossHealth(this.health, this.maxHealth);
    }

    // Check enraged state
    if (this.health < this.maxHealth * 0.4 && !this.isEnraged) {
      this.isEnraged = true;
      this.speed *= 1.3;
      this.setTint(0xff3300);
      this.scene.cameras.main.shake(300, 0.02);
    }

    if (this.health <= 0) {
      this.health = 0;
      this.die();
      return;
    }

    this.isHurt = true;
    this.setFrame(3);

    this.scene.time.delayedCall(250, () => {
      if (this.active && !this.isDead) {
        if (!this.isEnraged) this.clearTint();
        this.setFrame(0);
        this.isHurt = false;
      }
    });
  }

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.setFrame(3);
    audioManager.stopBGM();
    audioManager.playVictory();

    if (this.scene.hud) {
      this.scene.hud.hideBossBar();
    }

    // Large RIVAL DEFEATED! popup
    const defeatedTxt = this.scene.add.text(480, 240, "RIVAL DEFEATED!", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "40px",
      color: "#feca57",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    this.scene.tweens.add({
      targets: defeatedTxt,
      scale: { from: 0.5, to: 1.2 },
      duration: 800,
      ease: 'Back.out',
      onComplete: () => {
        this.scene.time.delayedCall(1500, () => {
          defeatedTxt.destroy();
          this.scene.onBossDefeated(this.bossData);
        });
      }
    });

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.destroy()
    });
  }
}
