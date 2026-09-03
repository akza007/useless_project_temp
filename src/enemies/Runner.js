import { Enemy } from '../entities/Enemy.js';
import { ENEMY_TYPES } from '../data/enemyData.js';

export class Runner extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_TYPES.RUNNER);
  }

  update(player) {
    super.update(player);
    // Extra fast sprint logic
    if (this.state === 'CHASE' && !this.isHurt && !this.isDead) {
      const dir = player.x > this.x ? 1 : -1;
      this.setVelocityX(dir * (this.speed * 1.2));
    }
  }
}
