import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class LucasLee extends Boss {
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
        this.skateboardGrindCharge(player);
      } else {
        this.stuntmanSlam(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  skateboardGrindCharge(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playHeavy();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 520);

    this.scene.time.delayedCall(400, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 65) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.setVelocityX(0);
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2200, () => {
      this.attackCooldown = false;
    });
  }

  stuntmanSlam(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playGroundSlam();
    this.scene.cameras.main.shake(250, 0.02);

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (dist <= 90) {
      this.scene.combatSystem.registerEnemyAttack(this, player);
    }

    this.scene.time.delayedCall(400, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2600, () => {
      this.attackCooldown = false;
    });
  }
}
