import { audioManager } from '../systems/AudioManager.js';
import { SaveSystem } from '../systems/SaveSystem.js';

const Phaser = window.Phaser;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, stats) {
    super(scene, x, y, 'alex_ryder', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Disable mouse interaction so clicking the sprite NEVER triggers menus
    this.disableInteractive();

    this.stats = stats;
    this.setScale(2.0);
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setSize(24, 42);
    this.setOffset(12, 6);

    // States
    this.isAttacking = false;
    this.isDashing = false;
    this.isHurt = false;
    this.isDead = false;
    this.isInvincible = false;
    this.facingRight = true;

    // Cooldowns
    this.attackCooldown = false;
    this.dashCooldown = false;

    // Direct Key Bindings
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attackJ: Phaser.Input.Keyboard.KeyCodes.J,
      specialK: Phaser.Input.Keyboard.KeyCodes.K,
      dashL: Phaser.Input.Keyboard.KeyCodes.L,
      pauseEsc: Phaser.Input.Keyboard.KeyCodes.ESC
    });

    // Energy regeneration timer
    scene.time.addEvent({
      delay: 500,
      callback: () => {
        if (!this.isDead && this.stats.energy < this.stats.maxEnergy) {
          this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + 4);
          if (this.scene.hud) this.scene.hud.updateBars(this.stats);
        }
      },
      loop: true
    });
  }

  update() {
    if (this.isDead) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.pauseEsc)) {
      this.scene.scene.pause();
      this.scene.scene.launch('PauseScene');
      return;
    }

    if (this.isHurt || this.isDashing) return;

    // Attack Input Controls (J = Light, K = Heavy/Special)
    if (Phaser.Input.Keyboard.JustDown(this.keys.attackJ) && !this.attackCooldown) {
      this.executeLightAttack();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.specialK) && !this.attackCooldown) {
      if (this.stats.energy >= 30) {
        this.executeSpecialAttack();
      } else {
        this.executeHeavyAttack();
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.dashL) && !this.dashCooldown) {
      this.executeDash();
      return;
    }

    // Movement
    if (this.isAttacking) return;

    const moveLeft = this.keys.left.isDown || this.keys.leftArrow.isDown;
    const moveRight = this.keys.right.isDown || this.keys.rightArrow.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.upArrow) ||
      Phaser.Input.Keyboard.JustDown(this.keys.space);

    if (moveLeft) {
      this.setVelocityX(-this.stats.speed);
      this.setFlipX(true);
      this.facingRight = false;
      if (this.body.blocked.down) this.play('alex_walk', true);
    } else if (moveRight) {
      this.setVelocityX(this.stats.speed);
      this.setFlipX(false);
      this.facingRight = true;
      if (this.body.blocked.down) this.play('alex_walk', true);
    } else {
      this.setVelocityX(0);
      if (this.body.blocked.down) this.play('alex_idle', true);
    }

    // Jumping
    if (jump && this.body.blocked.down) {
      this.setVelocityY(-420);
      audioManager.playJump();
    }
  }

  executeLightAttack() {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(this.facingRight ? 80 : -80);

    const isKick = Math.random() > 0.5;
    this.play(isKick ? 'alex_kick' : 'alex_punch');

    this.scene.time.delayedCall(120, () => {
      this.scene.combatSystem.checkPlayerAttack(this, 'light');
    });

    this.scene.time.delayedCall(300, () => {
      this.isAttacking = false;
      this.attackCooldown = false;
    });
  }

  executeHeavyAttack() {
    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(this.facingRight ? 120 : -120);

    this.play('alex_heavy');

    this.scene.time.delayedCall(200, () => {
      this.scene.combatSystem.checkPlayerAttack(this, 'heavy');
    });

    this.scene.time.delayedCall(500, () => {
      this.isAttacking = false;
      this.attackCooldown = false;
    });
  }

  executeSpecialAttack() {
    this.stats.energy -= 30;
    if (this.scene.hud) this.scene.hud.updateBars(this.stats);

    this.isAttacking = true;
    this.attackCooldown = true;
    this.setVelocityX(0);

    this.play('alex_heavy');

    // Energy aura effect
    const aura = this.scene.add.circle(this.x, this.y, 40, 0x00f0ff, 0.6);
    this.scene.tweens.add({
      targets: aura,
      scale: 2,
      alpha: 0,
      duration: 400,
      onComplete: () => aura.destroy()
    });

    this.scene.time.delayedCall(150, () => {
      this.scene.combatSystem.checkPlayerAttack(this, 'special');
    });

    this.scene.time.delayedCall(600, () => {
      this.isAttacking = false;
      this.attackCooldown = false;
    });
  }

  executeDash() {
    this.isDashing = true;
    this.dashCooldown = true;
    this.isInvincible = true;

    audioManager.playDash();
    this.setVelocityX(this.facingRight ? this.stats.speed * 2.2 : -this.stats.speed * 2.2);

    const ghost = this.scene.add.sprite(this.x, this.y, 'alex_ryder', this.frame.name)
      .setFlipX(!this.facingRight)
      .setAlpha(0.6);
    this.scene.tweens.add({
      targets: ghost,
      alpha: 0,
      duration: 250,
      onComplete: () => ghost.destroy()
    });

    this.scene.time.delayedCall(250, () => {
      this.isDashing = false;
      this.isInvincible = false;
    });

    this.scene.time.delayedCall(800, () => {
      this.dashCooldown = false;
    });
  }

  takeDamage(amount, attackerX) {
    if (this.isInvincible || this.isDead) return;

    this.stats.health -= amount;
    if (this.scene.hud) this.scene.hud.updateBars(this.stats);

    if (this.stats.health <= 0) {
      this.stats.health = 0;
      this.die();
      return;
    }

    this.isHurt = true;
    this.isInvincible = true;
    this.play('alex_hurt');

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 8,
      onComplete: () => {
        this.setAlpha(1);
        this.isInvincible = false;
      }
    });

    this.scene.time.delayedCall(400, () => {
      this.isHurt = false;
    });
  }

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.play('alex_hurt');
    this.setTint(0xff0000);
    audioManager.playGameOver();

    // Always reset stage progress to 1 on death
    const saveData = SaveSystem.loadGame();
    saveData.currentLevel = 1;
    SaveSystem.saveGame(saveData);

    this.scene.time.delayedCall(1500, () => {
      this.scene.scene.start('GameOverScene', { score: this.stats.score, level: 1 });
    });
  }
}
