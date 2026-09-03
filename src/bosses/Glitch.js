import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Glitch extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);
  }

  update(player) {
    if (this.isDead || this.isHurt || !this.body || !player) return;

    if (player.x > this.x) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
    }

    if (!this.attackCooldown) {
      const rand = Math.random();
      if (rand < 0.5) {
        this.triggerCyberGlitch(player);
      } else {
        this.glitchHazardSpawn(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  triggerCyberGlitch(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playElectricZap();

    // Camera color glitch
    this.scene.cameras.main.setTint(0x00ff66);

    // Glitch HUD temporary
    if (this.scene.hud) {
      this.scene.hud.glitchEffect();
    }

    this.scene.time.delayedCall(800, () => {
      this.scene.cameras.main.clearTint();
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2500, () => {
      this.attackCooldown = false;
    });
  }

  glitchHazardSpawn(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playTone(80, 'sawtooth', 0.3, 0.4);

    const hazardX = player.x;
    const hazard = this.scene.add.rectangle(hazardX, 420, 50, 40, 0x00ff66, 0.7);
    this.scene.physics.add.existing(hazard);

    this.scene.tweens.add({
      targets: hazard,
      scaleY: 1.8,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        if (hazard.active) {
          const dist = Phaser.Math.Distance.Between(hazard.x, hazard.y, player.x, player.y);
          if (dist <= 40) {
            this.scene.combatSystem.registerEnemyAttack(this, player);
          }
          hazard.destroy();
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2800, () => {
      this.attackCooldown = false;
    });
  }
}
