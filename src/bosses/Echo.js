import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Echo extends Boss {
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

    // Mirror player's state
    if (player.isAttacking && !this.attackCooldown) {
      this.mirrorAttack(player);
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  mirrorAttack(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playPunch();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 300);
    this.setFrame(2);

    this.scene.time.delayedCall(150, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 65) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
      }
    });

    this.scene.time.delayedCall(400, () => {
      this.setFrame(0);
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(1400, () => {
      this.attackCooldown = false;
    });
  }
}
