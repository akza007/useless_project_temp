import { Boss } from '../entities/Boss.js';
import { audioManager } from '../systems/AudioManager.js';

export class KatayanagiTwins extends Boss {
  constructor(scene, x, y, bossData) {
    super(scene, x, y, bossData);

    // Spawn Second Twin (Ken Katayanagi)
    this.twin = scene.physics.add.sprite(x + 50, y, 'katayanagi_twins', 0);
    this.twin.setScale(0.15);
    this.twin.setTint(0x1abc9c);
    scene.physics.add.existing(this.twin);
    scene.physics.add.collider(this.twin, scene.platforms);
  }

  update(player) {
    if (this.isDead || this.isHurt || !this.body || !player) {
      if (this.twin && this.isDead) this.twin.destroy();
      return;
    }

    if (player.x > this.x) {
      this.setFlipX(false);
      if (this.twin) this.twin.setFlipX(false);
    } else {
      this.setFlipX(true);
      if (this.twin) this.twin.setFlipX(true);
    }

    // Keep second twin near main twin
    if (this.twin && this.twin.active) {
      this.twin.setPosition(this.x + 45, this.y);
    }

    if (!this.attackCooldown) {
      const rand = Math.random();
      if (rand < 0.5) {
        this.twinPincerStrike(player);
      } else {
        this.twinSonicPulse(player);
      }
    } else if (!this.isAttacking) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    }
  }

  twinPincerStrike(player) {
    this.isAttacking = true;
    this.attackCooldown = true;

    audioManager.playPunch();
    const dir = player.x > this.x ? 1 : -1;
    this.setVelocityX(dir * 380);

    this.scene.time.delayedCall(200, () => {
      if (this.active && !this.isDead) {
        const dist1 = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const dist2 = this.twin ? Phaser.Math.Distance.Between(this.twin.x, this.twin.y, player.x, player.y) : 999;
        if (dist1 <= 70 || dist2 <= 70) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2000, () => {
      this.attackCooldown = false;
    });
  }

  twinSonicPulse(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    audioManager.playTone(440, 'square', 0.2, 0.3);

    const ring = this.scene.physics.add.sprite(this.x, this.y, 'soundwave_ring');
    ring.setTint(0x2ecc71);
    this.scene.tweens.add({
      targets: ring,
      scale: 3.5,
      alpha: 0,
      duration: 600,
      onComplete: () => ring.destroy()
    });

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= 110) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(2600, () => {
      this.attackCooldown = false;
    });
  }

  die() {
    if (this.twin) this.twin.destroy();
    super.die();
  }
}
