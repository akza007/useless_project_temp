import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class GideonGraves extends Boss {
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

    const hpRatio = this.health / this.maxHealth;
    if (hpRatio > 0.75) this.phase = 1;
    else if (hpRatio > 0.5) this.phase = 2;
    else if (hpRatio > 0.25) this.phase = 3;
    else this.phase = 4;

    if (!this.attackCooldown) {
      if (this.phase === 1) {
        this.pixelSwordSlash(player);
      } else if (this.phase === 2) {
        this.glowTelekinesis(player);
      } else if (this.phase === 3) {
        this.subspaceSlashCombo(player);
      } else {
        this.finalDesperateAllOut(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * (this.speed * (1 + (4 - this.phase) * 0.12)));
    }
  }

  pixelSwordSlash(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playPunch();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 350);

    this.scene.time.delayedCall(180, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 75) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1400, () => {
      this.attackCooldown = false;
    });
  }

  glowTelekinesis(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playSpecial();
    this.scene.cameras.main.shake(200, 0.015);

    const aura = this.scene.add.circle(this.x, this.y, 30, 0xff0055, 0.7);
    this.scene.tweens.add({
      targets: aura,
      scale: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => aura.destroy()
    });

    this.scene.time.delayedCall(250, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 100) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1800, () => {
      this.attackCooldown = false;
    });
  }

  subspaceSlashCombo(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playDash();
    this.setAlpha(0.2);

    this.scene.time.delayedCall(200, () => {
      if (this.active && !this.isDead) {
        const targetX = player.x + (player.facingRight ? -60 : 60);
        this.setPosition(targetX, player.y);
        if (this.body) this.body.reset(targetX, player.y);
        this.setAlpha(1);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 75) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2000, () => {
      this.attackCooldown = false;
    });
  }

  finalDesperateAllOut(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playHeavy();
    this.setTint(0xff0000);
    this.scene.cameras.main.shake(300, 0.03);

    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 650);

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
