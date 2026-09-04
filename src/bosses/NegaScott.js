import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class NegaScott extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);
    this.setTint(0x8e44ad);
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
      if (rand < 0.33) {
        this.shadowDashCombo(player);
      } else if (rand < 0.66) {
        this.darkEnergyPulse(player);
      } else {
        this.doppelgangerSlash(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  shadowDashCombo(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playDash();
    this.setAlpha(0.4);

    this.scene.time.delayedCall(200, () => {
      if (this.active && !this.isDead) {
        const targetX = player.x + (player.x > this.x ? -50 : 50);
        this.setPosition(targetX, player.y);
        if (this.body) this.body.reset(targetX, player.y);
        this.setAlpha(1);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 80) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1600, () => {
      this.attackCooldown = false;
    });
  }

  darkEnergyPulse(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playSpecial();

    const ring = this.scene.physics.add.sprite(this.x, this.y, 'soundwave_ring');
    ring.setTint(0x9b59b6);
    this.scene.tweens.add({
      targets: ring,
      scale: 3.8,
      alpha: 0,
      duration: 550,
      onComplete: () => ring.destroy()
    });

    this.scene.time.delayedCall(250, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 115) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2200, () => {
      this.attackCooldown = false;
    });
  }

  doppelgangerSlash(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playPunch();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 420);

    this.scene.time.delayedCall(160, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 80) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1700, () => {
      this.attackCooldown = false;
    });
  }
}
