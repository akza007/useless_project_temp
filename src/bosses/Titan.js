import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Titan extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);
    this.defense = 15; // High armor
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
        this.heavyGroundSlam(player);
      } else {
        this.shoulderCharge(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  heavyGroundSlam(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    // Jump up then slam down
    this.setVelocityY(-300);

    this.scene.time.delayedCall(400, () => {
      if (this.active && !this.isDead) {
        audioManager.playGroundSlam();
        this.scene.cameras.main.shake(300, 0.03);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 120 && player.body.blocked.down) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }

        // Debris shockwaves
        for (let i = -2; i <= 2; i += 4) {
          const rock = this.scene.add.rectangle(this.x + i * 30, 430, 24, 24, 0xe67e22);
          this.scene.tweens.add({
            targets: rock,
            y: 380,
            alpha: 0,
            duration: 400,
            onComplete: () => rock.destroy()
          });
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2800, () => {
      this.attackCooldown = false;
    });
  }

  shoulderCharge(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playHeavy();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 400);

    this.scene.time.delayedCall(500, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 70) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.setVelocityX(0);
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2500, () => {
      this.attackCooldown = false;
    });
  }
}
