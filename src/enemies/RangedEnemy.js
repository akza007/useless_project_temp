import { Enemy } from '../entities/Enemy.js';
import { ENEMY_TYPES } from '../data/enemyData.js';

export class RangedEnemy extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_TYPES.RANGED);
  }

  executeAttack(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);
    this.setFrame(2);

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead && !this.isHurt) {
        this.fireProjectile(player);
      }
    });

    this.scene.time.delayedCall(600, () => {
      if (this.active && !this.isDead) {
        this.setFrame(0);
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(this.attackCooldownTime, () => {
      this.attackCooldown = false;
    });
  }

  fireProjectile(player) {
    const proj = this.scene.physics.add.sprite(this.x, this.y - 10, 'projectile_bolt');
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.scene.physics.velocityFromRotation(angle, 300, proj.body.velocity);

    this.scene.physics.add.overlap(proj, player, () => {
      if (proj.active) {
        proj.destroy();
        this.scene.combatSystem.registerEnemyAttack(this, player);
      }
    });

    this.scene.time.delayedCall(3000, () => {
      if (proj.active) proj.destroy();
    });
  }
}
