import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class ToddIngram extends Boss {
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
        this.veganTelekineticPulse(player);
      } else {
        this.veganForcefieldPush(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  veganTelekineticPulse(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playSpecial();

    // Telekinetic aura
    const pulse = this.scene.add.circle(this.x, this.y, 20, 0x00f0ff, 0.7);
    this.scene.tweens.add({
      targets: pulse,
      scale: 4,
      alpha: 0,
      duration: 600,
      onComplete: () => pulse.destroy()
    });

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 120) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2400, () => {
      this.attackCooldown = false;
    });
  }

  veganForcefieldPush(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playElectricZap();

    const shield = this.scene.add.circle(this.x, this.y, 50, 0xffffff, 0.8);
    this.scene.tweens.add({
      targets: shield,
      alpha: 0,
      duration: 400,
      onComplete: () => shield.destroy()
    });

    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 400);

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 75) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2500, () => {
      this.attackCooldown = false;
    });
  }
}
