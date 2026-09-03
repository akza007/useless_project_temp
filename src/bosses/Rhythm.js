import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Rhythm extends Boss {
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
      this.beatPulseAttack(player);
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  beatPulseAttack(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    // Emit 3 rhythmic soundwave rings
    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 350, () => {
        if (!this.active || this.isDead) return;

        audioManager.playTone(300 + i * 150, 'sine', 0.15, 0.3);

        const ring = this.scene.physics.add.sprite(this.x, this.y, 'soundwave_ring');
        ring.setScale(0.5);

        this.scene.tweens.add({
          targets: ring,
          scale: 3.5,
          alpha: 0,
          duration: 700,
          onUpdate: () => {
            if (ring.active) {
              const dist = Phaser.Math.Distance.Between(ring.x, ring.y, player.x, player.y);
              if (dist <= ring.displayWidth / 2 && !player.isInvincible) {
                this.scene.combatSystem.registerEnemyAttack(this, player);
              }
            }
          },
          onComplete: () => ring.destroy()
        });
      });
    }

    this.scene.time.delayedCall(1200, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2600, () => {
      this.attackCooldown = false;
    });
  }
}
