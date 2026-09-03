import { Enemy } from '../entities/Enemy.js';
import { ENEMY_TYPES } from '../data/enemyData.js';

export class StreetPunk extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_TYPES.STREET_PUNK);
  }
}
