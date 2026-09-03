import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'coin') {
    let texture = 'pickup_coin';
    if (type === 'health') texture = 'pickup_health';
    else if (type === 'energy') texture = 'pickup_energy';
    else if (type === 'xp') texture = 'pickup_xp';

    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.setBounce(0.5);
    this.setCollideWorldBounds(true);
    this.setVelocity(Phaser.Math.Between(-80, 80), -180);

    // Floating bobbing tween
    scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  collect(player) {
    if (!this.active) return;

    if (this.type === 'health') {
      player.stats.health = Math.min(player.stats.maxHealth, player.stats.health + 30);
      audioManager.playHealth();
    } else if (this.type === 'energy') {
      player.stats.energy = Math.min(player.stats.maxEnergy, player.stats.energy + 40);
      audioManager.playHealth();
    } else if (this.type === 'coin') {
      player.stats.coins += 25;
      player.stats.score += 50;
      audioManager.playCoin();
    } else if (this.type === 'xp') {
      player.stats.xp += 30;
      audioManager.playCoin();
    }

    if (this.scene.hud) {
      this.scene.hud.updateBars(player.stats);
      this.scene.hud.updateTopInfo(player.stats);
    }

    this.destroy();
  }
}
