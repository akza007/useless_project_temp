import { Player } from '../entities/Player.js';
import { StreetPunk } from '../enemies/StreetPunk.js';
import { Runner } from '../enemies/Runner.js';
import { Bruiser } from '../enemies/Bruiser.js';
import { RangedEnemy } from '../enemies/RangedEnemy.js';
import { MatthewPatel } from '../bosses/MatthewPatel.js';
import { LucasLee } from '../bosses/LucasLee.js';
import { RoxieRichter } from '../bosses/RoxieRichter.js';
import { ToddIngram } from '../bosses/ToddIngram.js';
import { KatayanagiTwins } from '../bosses/KatayanagiTwins.js';
import { GideonGraves } from '../bosses/GideonGraves.js';
import { Pickup } from '../entities/Pickup.js';
import { HUD } from '../ui/HUD.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { BOSS_DATA } from '../data/bossData.js';
import { audioManager } from '../systems/AudioManager.js';

const Phaser = window.Phaser;

export class LevelScene extends Phaser.Scene {
  constructor() {
    super('LevelScene');
  }

  init(data) {
    this.currentLevel = data.stage || 1;
  }

  create() {
    // Focus canvas for instant keyboard control
    if (this.sys && this.sys.game && this.sys.game.canvas) {
      this.sys.game.canvas.focus();
    }

    this.saveData = SaveSystem.loadGame();
    this.physics.world.setBounds(0, 0, 2400, 540);

    // Parallax background
    this.bg = this.add.tileSprite(0, 0, 2400, 540, 'bg_parallax_city').setOrigin(0, 0);

    // Static Platforms & Ground
    this.platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(1200, 490, 2400, 100, 0x000000, 0);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    this.createPlatforms();

    // Spawning Groups
    this.enemies = this.physics.add.group({ runChildUpdate: false });
    this.pickups = this.physics.add.group();
    this.boss = null;
    this.bossSpawned = false;

    // Playable Player (Scott Pilgrim - Full HP & Energy on start)
    this.saveData.playerStats.health = this.saveData.playerStats.maxHealth;
    this.saveData.playerStats.energy = this.saveData.playerStats.maxEnergy;
    this.player = new Player(this, 100, 340, this.saveData.playerStats);
    this.physics.add.collider(this.player, this.platforms);

    // Camera setup
    this.cameras.main.setBounds(0, 0, 2400, 540);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Systems & HUD
    this.combatSystem = new CombatSystem(this);
    this.hud = new HUD(this);
    this.hud.updateStageLevel(this.currentLevel);
    this.hud.updateBars(this.player.stats);
    this.hud.updateTopInfo(this.player.stats);

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.pickups, (p, pickup) => {
      pickup.collect(p);
    });

    this.waveSpawnedX = [];
    this.createBossEntranceSign();

    audioManager.startBGM('stage');
  }

  createPlatforms() {
    const platformCoords = [
      { x: 400, y: 360 },
      { x: 800, y: 320 },
      { x: 1200, y: 360 },
      { x: 1600, y: 320 }
    ];

    platformCoords.forEach(p => {
      const plat = this.physics.add.staticSprite(p.x, p.y, 'tile_platform');
      this.platforms.add(plat);
    });
  }

  createBossEntranceSign() {
    const label = this.currentLevel === 6 ? "STAGE 6: BRUTAL GAUNTLET" : "WARNING!\nRIVAL ARENA AHEAD ▶";
    this.add.text(1800, 320, label, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "14px",
      color: "#ff0055",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center"
    }).setOrigin(0.5);
  }

  update() {
    if (!this.player || this.player.isDead) return;

    this.player.update();

    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active && enemy.update) {
        enemy.update(this.player);
      }
    });

    if (this.boss && this.boss.active && this.boss.update) {
      this.boss.update(this.player);
    }

    if (!this.bossSpawned) {
      if (this.player.x > 350 && !this.waveSpawnedX.includes(350)) {
        this.spawnEnemyWave(1);
        this.waveSpawnedX.push(350);
      } else if (this.player.x > 850 && !this.waveSpawnedX.includes(850)) {
        this.spawnEnemyWave(2);
        this.waveSpawnedX.push(850);
      } else if (this.player.x > 1350 && !this.waveSpawnedX.includes(1350)) {
        this.spawnEnemyWave(3);
        this.waveSpawnedX.push(1350);
      } else if (this.player.x >= 1800) {
        if (this.currentLevel === 6) {
          this.triggerGauntletCompletion();
        } else {
          this.triggerBossSpawn();
        }
      }
    }
  }

  spawnEnemyWave(waveIndex) {
    const px = this.player.x;

    if (this.currentLevel === 6) {
      this.enemies.add(new Bruiser(this, px + 300, 340));
      this.enemies.add(new Runner(this, px + 400, 340));
      this.enemies.add(new RangedEnemy(this, px + 520, 340));
      this.enemies.add(new StreetPunk(this, px + 600, 340));
    } else if (waveIndex === 1) {
      this.enemies.add(new StreetPunk(this, px + 350, 340));
      this.enemies.add(new Runner(this, px + 450, 340));
    } else if (waveIndex === 2) {
      this.enemies.add(new StreetPunk(this, px + 300, 340));
      this.enemies.add(new Bruiser(this, px + 420, 340));
      this.enemies.add(new RangedEnemy(this, px + 500, 340));
    } else if (waveIndex === 3) {
      this.enemies.add(new Runner(this, px + 300, 340));
      this.enemies.add(new Bruiser(this, px + 400, 340));
      this.enemies.add(new RangedEnemy(this, px + 520, 340));
    }
  }

  triggerGauntletCompletion() {
    this.bossSpawned = true;
    audioManager.playVictory();

    const txt = this.add.text(480, 240, "GAUNTLET CLEARED!\nPROCEED TO GIDEON'S ARENA!", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "20px",
      color: "#00f0ff",
      align: "center",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    this.time.delayedCall(2000, () => {
      txt.destroy();
      this.saveData.currentLevel = 7;
      SaveSystem.saveGame(this.saveData);
      this.scene.start('UpgradeScene');
    });
  }

  triggerBossSpawn() {
    this.bossSpawned = true;

    this.cameras.main.stopFollow();
    this.cameras.main.pan(2000, 270, 800);
    this.physics.world.setBounds(1520, 0, 960, 540);

    const bossInfo = BOSS_DATA.find(b => b.id === this.currentLevel) || BOSS_DATA[0];
    const spawnX = 2200;
    const spawnY = 340;

    if (this.currentLevel === 1) {
      this.boss = new MatthewPatel(this, spawnX, spawnY, bossInfo);
    } else if (this.currentLevel === 2) {
      this.boss = new LucasLee(this, spawnX, spawnY, bossInfo);
    } else if (this.currentLevel === 3) {
      this.boss = new RoxieRichter(this, spawnX, spawnY, bossInfo);
    } else if (this.currentLevel === 4) {
      this.boss = new ToddIngram(this, spawnX, spawnY, bossInfo);
    } else if (this.currentLevel === 5) {
      this.boss = new KatayanagiTwins(this, spawnX, spawnY, bossInfo);
    } else {
      this.boss = new GideonGraves(this, spawnX, spawnY, bossInfo);
    }

    this.physics.add.collider(this.boss, this.platforms);
  }

  spawnPickup(x, y) {
    const types = ['coin', 'coin', 'coin', 'xp', 'health', 'energy'];
    const selected = types[Math.floor(Math.random() * types.length)];
    const item = new Pickup(this, x, y, selected);
    this.pickups.add(item);
    this.physics.add.collider(item, this.platforms);
  }

  onBossDefeated(bossData) {
    this.scene.start('VictoryScene', {
      bossData: bossData,
      playerStats: this.player.stats
    });
  }
}
