export const INITIAL_PLAYER_STATS = {
  health: 200,
  maxHealth: 200,
  attackDamage: 25,
  defense: 10,
  speed: 250,
  energy: 100,
  maxEnergy: 100,
  lives: 3,
  score: 0,
  coins: 100,
  xp: 0,
  level: 1,
  specialDamage: 70,
  name: 'Scott Pilgrim'
};

export const UPGRADE_CONFIG = {
  maxHealth: { name: "MAX HEALTH", cost: 50, costMult: 1.3, increment: 40, max: 500 },
  attackDamage: { name: "ATTACK DAMAGE", cost: 60, costMult: 1.3, increment: 10, max: 100 },
  defense: { name: "DEFENSE", cost: 50, costMult: 1.3, increment: 5, max: 50 },
  energy: { name: "MAX ENERGY", cost: 40, costMult: 1.3, increment: 30, max: 300 },
  speed: { name: "MOVEMENT SPEED", cost: 50, costMult: 1.3, increment: 25, max: 400 },
  specialDamage: { name: "SPECIAL POWER", cost: 70, costMult: 1.3, increment: 25, max: 200 }
};
