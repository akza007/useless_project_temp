import { Enemy } from '../entities/Enemy.js';
import { ENEMY_TYPES } from '../data/enemyData.js';

export class Bruiser extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_TYPES.BRUISER);
    this.setScale(1.2);
  }
}
