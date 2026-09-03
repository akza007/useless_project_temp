export const INITIAL_PLAYER_STATS = {
  health: 100,
  maxHealth: 100,
  attackDamage: 10,
  defense: 5,
  speed: 220,
  energy: 100,
  maxEnergy: 100,
  lives: 1,
  score: 0,
  coins: 0,
  xp: 0,
  level: 1,
  specialDamage: 35,
  name: 'Scott Pilgrim'
};

export const UPGRADE_CONFIG = {
  maxHealth: { name: "MAX HEALTH", cost: 100, costMult: 1.5, increment: 25, max: 300 },
  attackDamage: { name: "ATTACK DAMAGE", cost: 120, costMult: 1.6, increment: 5, max: 50 },
  defense: { name: "DEFENSE", cost: 100, costMult: 1.5, increment: 3, max: 30 },
  energy: { name: "MAX ENERGY", cost: 90, costMult: 1.4, increment: 20, max: 200 },
  speed: { name: "MOVEMENT SPEED", cost: 110, costMult: 1.5, increment: 20, max: 340 },
  specialDamage: { name: "SPECIAL POWER", cost: 150, costMult: 1.7, increment: 15, max: 120 }
};
