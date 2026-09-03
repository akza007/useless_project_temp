import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class Voltage extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);
  }

  update(player) {
    if (this.isDead || this.isHurt || !this.body || !player) return;

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    if (player.x > this.x) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
    }

    if (!this.attackCooldown) {
      const rand = Math.random();
      if (rand < 0.45) {
        this.lightningDash(player);
      } else if (rand < 0.8) {
        this.electricBolt(player);
      } else {
        this.groundShockwave();
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * (this.speed * 0.7));
    }
  }

  lightningDash(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playElectricZap();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 550);

    const trail = this.scene.add.rectangle(this.x, this.y, 40, 40, 0x00f0ff, 0.7);
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: 2,
      duration: 300,
      onComplete: () => trail.destroy()
    });

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 60) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.setVelocityX(0);
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(1800, () => {
      this.attackCooldown = false;
    });
  }

  electricBolt(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playElectricZap();
    const bolt = this.scene.physics.add.sprite(this.x, this.y - 10, 'projectile_bolt');
    bolt.setTint(0x00f0ff);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.scene.physics.velocityFromRotation(angle, 400, bolt.body.velocity);

    this.scene.physics.add.overlap(bolt, player, () => {
      if (bolt.active) {
        bolt.destroy();
        this.scene.combatSystem.registerEnemyAttack(this, player);
      }
    });

    this.scene.time.delayedCall(400, () => {
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(2200, () => {
      this.attackCooldown = false;
    });
  }

  groundShockwave() {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playGroundSlam();
    this.scene.cameras.main.shake(200, 0.015);

    const waveLeft = this.scene.add.rectangle(this.x - 20, 430, 20, 30, 0x00f0ff);
    const waveRight = this.scene.add.rectangle(this.x + 20, 430, 20, 30, 0x00f0ff);
    this.scene.physics.add.existing(waveLeft);
    this.scene.physics.add.existing(waveRight);

    waveLeft.body.setVelocityX(-350);
    waveRight.body.setVelocityX(350);

    const checkHit = (wave) => {
      this.scene.physics.add.overlap(wave, this.scene.player, () => {
        if (wave.active) {
          wave.destroy();
          this.scene.combatSystem.registerEnemyAttack(this, this.scene.player);
        }
      });
    };

    checkHit(waveLeft);
    checkHit(waveRight);

    this.scene.time.delayedCall(1500, () => {
      if (waveLeft.active) waveLeft.destroy();
      if (waveRight.active) waveRight.destroy();
      this.isAttacking = false;
    });

    this.scene.time.delayedCall(3000, () => {
      this.attackCooldown = false;
    });
  }
}
