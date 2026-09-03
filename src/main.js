import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { LevelScene } from './scenes/LevelScene.js';
import { UpgradeScene } from './scenes/UpgradeScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { PauseScene } from './scenes/PauseScene.js';

const Phaser = window.Phaser;

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: [
    BootScene,
    MenuScene,
    CharacterSelectScene,
    LevelScene,
    UpgradeScene,
    VictoryScene,
    GameOverScene,
    PauseScene
  ]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
