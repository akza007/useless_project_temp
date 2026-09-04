const Phaser = window.Phaser;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.config = config;
    this.key = config.key;
    this.name = config.name;
    this.health = config.health;
    this.maxHealth = config.maxHealth;
    this.damage = config.damage;
    this.speed = config.speed;
    this.attackRange = config.attackRange;
    this.attackCooldownTime = config.attackCooldown;
    this.type = config.type;

    this.setScale(0.15);
    this.setCollideWorldBounds(true);
    this.setSize(28, 38);
    this.setOffset(10, 10);

    // AI States
    this.state = 'IDLE';
    this.isAttacking = false;
    this.isHurt = false;
    this.isDead = false;
    this.attackCooldown = false;
    this.facingRight = true;

    // Small floating health bar
    this.healthBarBg = scene.add.rectangle(x, y - 30, 32, 6, 0x000000).setDepth(10);
    this.healthBar = scene.add.rectangle(x - 15, y - 30, 30, 4, 0x00f0ff).setOrigin(0, 0.5).setDepth(11);
  }

  update(player) {
    if (this.isDead) return;

    // Update health bar position
    if (this.healthBarBg && this.healthBar) {
      this.healthBarBg.setPosition(this.x, this.y - 30);
      this.healthBar.setPosition(this.x - 15, this.y - 30);
      const ratio = Math.max(0, this.health / this.maxHealth);
      this.healthBar.setSize(Math.round(30 * ratio), 4);
    }

    if (this.isHurt || this.isAttacking) return;

    if (!player || player.isDead) {
      this.state = 'IDLE';
      this.setVelocityX(0);
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    // Flip sprite towards player
    if (player.x > this.x) {
      this.setFlipX(false);
      this.facingRight = true;
    } else {
      this.setFlipX(true);
      this.facingRight = false;
    }

    // AI State Machine
    if (dist <= this.attackRange && !this.attackCooldown) {
      this.state = 'ATTACK';
      this.executeAttack(player);
    } else if (dist <= 350) {
      this.state = 'CHASE';
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * this.speed);
    } else {
      this.state = 'IDLE';
      this.setVelocityX(0);
    }
  }

  setFrameSafe(frame) {
    if (this.texture && this.texture.has(frame)) {
      this.setFrame(frame);
    }
  }

  executeAttack(player) {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    this.setFrame(2); // Attack frame

    this.scene.time.delayedCall(200, () => {
      if (this.active && !this.isDead && !this.isHurt) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist <= this.attackRange + 15) {
          this.scene.combatSystem.registerEnemyAttack(this, player);
        }
      }
    });

    this.scene.time.delayedCall(500, () => {
      if (this.active && !this.isDead) {
        this.setFrameSafe(0);
        this.isAttacking = false;
      }
    });

    this.scene.time.delayedCall(this.attackCooldownTime, () => {
      this.attackCooldown = false;
    });
  }

  takeDamage(amount, attackerX) {
    if (this.isDead) return;

    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
      return;
    }

    this.isHurt = true;
    this.setFrameSafe(3); // Hurt frame
    this.setTint(0xff4757);

    this.scene.time.delayedCall(300, () => {
      if (this.active && !this.isDead) {
        this.clearTint();
        this.setFrameSafe(0);
        this.isHurt = false;
      }
    });
  }

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.setFrameSafe(3);
    this.setTint(0x555555);

    if (this.healthBarBg) this.healthBarBg.destroy();
    if (this.healthBar) this.healthBar.destroy();

    // Reward player
    if (this.scene.player) {
      this.scene.player.stats.score += this.config.scoreReward;
      this.scene.player.stats.coins += this.config.coinReward;
      this.scene.player.stats.xp += this.config.xpReward;
      if (this.scene.hud) this.scene.hud.updateTopInfo(this.scene.player.stats);
    }

    // Spawn Pickups
    this.scene.spawnPickup(this.x, this.y);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      onComplete: () => this.destroy()
    });
  }
}
