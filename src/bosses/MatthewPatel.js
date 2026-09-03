import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class MatthewPatel extends Boss {
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
        this.fireMysticFireball(player);
      } else {
        this.summonDemonHipsterChick(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  fireMysticFireball(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playElectricZap();
    const bolt = this.scene.physics.add.sprite(this.x, this.y - 10, 'projectile_bolt');
    bolt.setTint(0xe74c3c);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.scene.physics.velocityFromRotation(angle, 420, bolt.body.velocity);

    this.scene.physics.add.overlap(bolt, player, () => {
      if (bolt.active) {
        bolt.destroy();
        this.scene.combatSystem.registerEnemyAttack(this, player);
      }
    });

    this.scene.time.delayedCall(400, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2000, () => {
      this.attackCooldown = false;
    });
  }

  summonDemonHipsterChick(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playSpecial();
    const chick = this.scene.physics.add.sprite(this.x, this.y - 60, 'matthew_patel', 0);
    chick.setScale(0.8);
    chick.setTint(0xff0080);
    chick.body.setAllowGravity(false);

    this.scene.tweens.add({
      targets: chick,
      x: player.x,
      y: player.y,
      duration: 800,
      onComplete: () => {
        if (chick.active) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
          chick.destroy();
        }
      }
    });

    this.scene.time.delayedCall(500, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2800, () => {
      this.attackCooldown = false;
    });
  }
}
