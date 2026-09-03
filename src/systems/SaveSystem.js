import { INITIAL_PLAYER_STATS } from '../data/playerData.js';

const SAVE_KEY = 'rival_rush_save_data_v1';

export class SaveSystem {
  static getInitialData() {
    return {
      currentLevel: 1,
      defeatedRivals: [],
      score: 0,
      coins: 0,
      xp: 0,
      playerStats: { ...INITIAL_PLAYER_STATS },
      upgrades: {
        maxHealth: 0,
        attackDamage: 0,
        defense: 0,
        energy: 0,
        speed: 0,
        specialDamage: 0
      },
      unlockedCharacters: ['alex_ryder']
    };
  }

  static loadGame() {
    try {
      const dataStr = localStorage.getItem(SAVE_KEY);
      if (!dataStr) return this.getInitialData();
      const parsed = JSON.parse(dataStr);
      return {
        ...this.getInitialData(),
        ...parsed,
        playerStats: {
          ...INITIAL_PLAYER_STATS,
          ...(parsed.playerStats || {})
        }
      };
    } catch (e) {
      console.warn("Failed to load save data from LocalStorage:", e);
      return this.getInitialData();
    }
  }

  static saveGame(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Failed to save game to LocalStorage:", e);
      return false;
    }
  }

  static resetSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
      return this.getInitialData();
    } catch (e) {
      console.error("Failed to reset save data:", e);
      return this.getInitialData();
    }
  }
}
