import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Mirage extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);
    this.clones = [];
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
        this.spawnShadowClones(player);
      } else {
        this.teleportBehindPlayer(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  spawnShadowClones(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playSpecial();

    // Spawn 2 phantom clones
    for (let i = 0; i < 2; i++) {
      const cloneX = this.x + (i === 0 ? -120 : 120);
      const clone = this.scene.physics.add.sprite(cloneX, this.y, 'mirage', 0);
      clone.setTint(0x9b59b6);
      clone.setAlpha(0.6);
      this.scene.physics.add.existing(clone);

      this.scene.physics.add.overlap(clone, player, () => {
        if (clone.active) {
          clone.destroy();
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
      });

      this.scene.tweens.add({
        targets: clone,
        x: player.x,
        duration: 1000,
        onComplete: () => {
          if (clone.active) clone.destroy();
        }
      });
    }

    this.scene.time.delayedCall(500, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(3000, () => {
      this.attackCooldown = false;
    });
  }

  teleportBehindPlayer(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playDash();
    this.setAlpha(0.2);

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
        const newX = player.x + (player.facingRight ? -80 : 80);
        this.setPosition(newX, player.y);
        this.setAlpha(1);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 60) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }

        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2400, () => {
      this.attackCooldown = false;
    });
  }
}
