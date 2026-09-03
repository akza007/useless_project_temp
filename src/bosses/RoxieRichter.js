import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class RoxieRichter extends Boss {
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
        this.ninjaTeleportSlash(player);
      } else {
        this.shadowWhipSlash(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  ninjaTeleportSlash(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playDash();
    this.setAlpha(0.2);

    this.scene.time.delayedCall(250, () => {
      if (this.active && !this.isDead) {
        const targetX = player.x + (player.facingRight ? -70 : 70);
        this.setPosition(targetX, player.y);
        this.setAlpha(1);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 65) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }

        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2200, () => {
      this.attackCooldown = false;
    });
  }

  shadowWhipSlash(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playPunch();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 350);

    this.scene.time.delayedCall(150, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 75) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1800, () => {
      this.attackCooldown = false;
    });
  }
}
