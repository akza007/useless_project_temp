import { audioManager } from './AudioManager.js';

export class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.comboCount = 0;
    this.comboTimer = null;
    this.comboMultiplier = 1;
  }

  checkPlayerAttack(player, attackType = 'light') {
    if (!player || !this.scene) return;

    const attackRange = attackType === 'special' ? 140 : attackType === 'heavy' ? 80 : 55;
    const facingRight = player.facingRight;

    const targets = [];
    if (this.scene.enemies) {
      this.scene.enemies.getChildren().forEach(e => {
        if (e.active && !e.isDead) targets.push(e);
      });
    }

    if (this.scene.boss && this.scene.boss.active && !this.scene.boss.isDead) {
      targets.push(this.scene.boss);
    }

    targets.forEach(target => {
      const inFrontX = facingRight ? (target.x >= player.x - 10 && target.x <= player.x + attackRange)
                                  : (target.x <= player.x + 10 && target.x >= player.x - attackRange);
      const closeY = Math.abs(target.y - player.y) <= 50;

      if (inFrontX && closeY) {
        this.registerPlayerAttack(player, target, attackType);
      }
    });
  }

  registerPlayerAttack(player, target, attackType = 'light') {
    if (!target || !target.active || target.isHurt || target.isDead || target.isInvincible) return;

    let baseDamage = player.stats.attackDamage;
    let knockbackX = 180;
    let knockbackY = -100;
    let shakeIntensity = 0.005;
    let popupText = "POW!";

    if (attackType === 'heavy') {
      baseDamage *= 2.2;
      knockbackX = 380;
      knockbackY = -220;
      shakeIntensity = 0.015;
      popupText = "WHAM!";
      audioManager.playHeavy();
    } else if (attackType === 'special') {
      baseDamage = player.stats.specialDamage;
      knockbackX = 450;
      knockbackY = -250;
      shakeIntensity = 0.025;
      popupText = "CRITICAL!";
      audioManager.playSpecial();
    } else {
      audioManager.playPunch();
    }

    // Defense reduction
    const defense = target.defense || 0;
    const finalDamage = Math.max(2, Math.round(baseDamage * (100 / (100 + defense)) * this.comboMultiplier));

    // Apply damage to target
    target.takeDamage(finalDamage, player.x);

    // Apply Knockback
    const dir = target.x > player.x ? 1 : -1;
    if (target.body) {
      target.body.setVelocityX(dir * knockbackX);
      target.body.setVelocityY(knockbackY);
    }

    // Freeze frame hit pause effect (80ms)
    if (this.scene.physics && this.scene.physics.world) {
      this.scene.physics.world.pause();
      setTimeout(() => {
        if (this.scene && this.scene.physics && this.scene.physics.world) {
          this.scene.physics.world.resume();
        }
      }, 80);
    }

    // Screen shake
    this.scene.cameras.main.shake(120, shakeIntensity);

    // Hit flash & spark particles
    this.createHitFlash(target.x, target.y - 10);
    this.createFloatingText(target.x, target.y - 30, popupText, '#ff4757', 24);
    this.createFloatingText(target.x + 10, target.y - 50, `-${finalDamage}`, '#ffffff', 18);

    // Increment combo
    this.incrementCombo(player);
  }

  registerEnemyAttack(enemy, player) {
    if (!player || !player.active || player.isInvincible || player.isDead) return;

    const baseDamage = enemy.damage || 10;
    const defense = player.stats.defense || 0;
    const finalDamage = Math.max(1, Math.round(baseDamage * (100 / (100 + defense))));

    player.takeDamage(finalDamage, enemy.x);

    // Knockback player
    const dir = player.x > enemy.x ? 1 : -1;
    if (player.body) {
      player.body.setVelocityX(dir * 250);
      player.body.setVelocityY(-120);
    }

    // Screen shake & hit flash
    this.scene.cameras.main.shake(150, 0.01);
    this.createHitFlash(player.x, player.y - 10);
    this.createFloatingText(player.x, player.y - 40, `-${finalDamage}`, '#ff0055', 20);

    audioManager.playHit();
  }

  incrementCombo(player) {
    this.comboCount++;
    if (this.comboCount >= 20) this.comboMultiplier = 3;
    else if (this.comboCount >= 10) this.comboMultiplier = 2;
    else if (this.comboCount >= 5) this.comboMultiplier = 1.5;
    else this.comboMultiplier = 1;

    player.stats.score += 10 * Math.floor(this.comboMultiplier);

    if (this.scene.hud) {
      this.scene.hud.updateCombo(this.comboCount, this.comboMultiplier);
    }

    // Milestone text
    if (this.comboCount === 5 || this.comboCount === 10 || this.comboCount === 20 || this.comboCount === 30) {
      this.createFloatingText(
        this.scene.cameras.main.scrollX + 480,
        this.scene.cameras.main.scrollY + 200,
        `${this.comboCount} HIT COMBO!`,
        '#00f0ff',
        32
      );
    }

    if (this.comboTimer) clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.comboCount = 0;
      this.comboMultiplier = 1;
      if (this.scene.hud) {
        this.scene.hud.updateCombo(0, 1);
      }
    }, 2500);
  }

  createHitFlash(x, y) {
    const flash = this.scene.add.sprite(x, y, 'particle_spark');
    flash.setScale(3);
    flash.setTint(0xffff00);
    this.scene.tweens.add({
      targets: flash,
      scale: 0.5,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });
  }

  createFloatingText(x, y, text, color = '#ffffff', fontSize = 20) {
    const txt = this.scene.add.text(x, y, text, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: `${fontSize}px`,
      color: color,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: y - 40,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      onComplete: () => txt.destroy()
    });
  }
}
