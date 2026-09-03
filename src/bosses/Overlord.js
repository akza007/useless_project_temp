import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Overlord extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);
    this.phase = 1;
  }

  update(player) {
    if (this.isDead || this.isHurt || !this.body || !player) return;

    if (player.x > this.x) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
    }

    // Phase transitions based on HP ratio
    const hpRatio = this.health / this.maxHealth;
    if (hpRatio > 0.75) {
      this.phase = 1; // Basic Strike
    } else if (hpRatio > 0.5) {
      this.phase = 2; // Electric Dash & Soundwave
    } else if (hpRatio > 0.25) {
      this.phase = 3; // Ground Slam & Clones
    } else {
      this.phase = 4; // Desperate All-Out Frenzy
    }

    if (!this.attackCooldown) {
      if (this.phase === 1) {
        this.basicPhaseAttack(player);
      } else if (this.phase === 2) {
        this.speedRhythmCombo(player);
      } else if (this.phase === 3) {
        this.slamCloneCombo(player);
      } else {
        this.finalDesperateFrenzy(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * (this.speed * (1 + (4 - this.phase) * 0.15)));
    }
  }

  basicPhaseAttack(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playPunch();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 320);

    this.scene.time.delayedCall(200, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 70) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1500, () => {
      this.attackCooldown = false;
    });
  }

  speedRhythmCombo(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playElectricZap();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 500);

    // Soundwave
    const ring = this.scene.physics.add.sprite(this.x, this.y, 'soundwave_ring');
    this.scene.tweens.add({
      targets: ring,
      scale: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => ring.destroy()
    });

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
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

  slamCloneCombo(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playGroundSlam();
    this.scene.cameras.main.shake(250, 0.02);

    // Spawn Shadow Phantom
    const clone = this.scene.physics.add.sprite(this.x - 100, this.y, 'mirage', 0);
    clone.setTint(0xff0033);
    this.scene.tweens.add({
      targets: clone,
      x: player.x,
      duration: 800,
      onComplete: () => {
        if (clone.active) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
          clone.destroy();
        }
      }
    });

    this.scene.time.delayedCall(400, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2200, () => {
      this.attackCooldown = false;
    });
  }

  finalDesperateFrenzy(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playSpecial();
    this.setTint(0xff0000);
    this.scene.cameras.main.shake(300, 0.03);

    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 600);

    this.scene.time.delayedCall(250, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 90) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1200, () => {
      this.attackCooldown = false;
    });
  }
}
