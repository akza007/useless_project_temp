export class TextureGenerator {
  static generateAll(scene) {
    this.createPlayerTextures(scene);
    this.createRamonaTextures(scene);
    this.createEnemyTextures(scene);
    this.createBossTextures(scene);
    this.createEffectTextures(scene);
    this.createPickupTextures(scene);
    this.createEnvironmentTextures(scene);
  }

  static drawOutlineRect(ctx, x, y, w, h, fillColor, outlineColor = '#000000', outlineWidth = 2) {
    ctx.fillStyle = outlineColor;
    ctx.fillRect(x - outlineWidth, y - outlineWidth, w + outlineWidth * 2, h + outlineWidth * 2);
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);
  }

  static registerPlayerAnimations(scene) {
    const keys = ['alex_idle', 'alex_walk', 'alex_punch', 'alex_kick', 'alex_heavy', 'alex_hurt', 'alex_victory'];
    keys.forEach(key => {
      if (!scene.anims.exists(key)) {
        scene.anims.create({
          key: key,
          frames: [{ key: 'alex_ryder', frame: 0 }],
          frameRate: 1,
          repeat: -1
        });
      }
    });
  }

  static createPlayerTextures(scene) {
    this.registerPlayerAnimations(scene);
    if (scene.textures.exists('alex_ryder')) return;

    // Sprite canvas: 192x192 (4 cols x 4 rows of 48x48)
    const canvas = scene.textures.createCanvas('alex_ryder', 192, 192);
    const ctx = canvas.context;

    const drawScottFrame = (col, row, pose = 'idle') => {
      const offsetX = col * 48;
      const offsetY = row * 48;

      ctx.save();
      ctx.translate(offsetX, offsetY);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(24, 44, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Scott Hair (Messy Shaggy Brown)
      this.drawOutlineRect(ctx, 14, 4, 20, 10, '#8e44ad'); // Hair highlight
      this.drawOutlineRect(ctx, 16, 6, 16, 8, '#6d4c41');

      // Head / Skin
      this.drawOutlineRect(ctx, 16, 12, 16, 12, '#ffccaa');

      // Big Arcade Eyes
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(24, 15, 4, 4);

      // Green Plumtree Shirt
      this.drawOutlineRect(ctx, 14, 22, 20, 16, '#2ecc71');
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(20, 26, 8, 8); // Yellow chest logo

      // Blue Denim Jeans
      this.drawOutlineRect(ctx, 16, 36, 16, 8, '#2980b9');

      // Red Wristbands / Sneakers
      if (pose === 'idle') {
        this.drawOutlineRect(ctx, 10, 24, 6, 10, '#ffccaa');
        this.drawOutlineRect(ctx, 32, 24, 6, 10, '#ffccaa');
        this.drawOutlineRect(ctx, 14, 40, 8, 6, '#e74c3c');
        this.drawOutlineRect(ctx, 26, 40, 8, 6, '#e74c3c');
      } else if (pose === 'walk1' || pose === 'walk3') {
        this.drawOutlineRect(ctx, 8, 24, 8, 10, '#2ecc71');
        this.drawOutlineRect(ctx, 32, 22, 8, 10, '#ffccaa');
        this.drawOutlineRect(ctx, 10, 39, 10, 6, '#e74c3c');
        this.drawOutlineRect(ctx, 28, 41, 10, 6, '#e74c3c');
      } else if (pose === 'walk2' || pose === 'walk4') {
        this.drawOutlineRect(ctx, 32, 24, 8, 10, '#2ecc71');
        this.drawOutlineRect(ctx, 8, 22, 8, 10, '#ffccaa');
        this.drawOutlineRect(ctx, 28, 39, 10, 6, '#e74c3c');
        this.drawOutlineRect(ctx, 10, 41, 10, 6, '#e74c3c');
      } else if (pose === 'punch') {
        this.drawOutlineRect(ctx, 30, 20, 16, 8, '#ffccaa');
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(42, 18, 6, 12);
        this.drawOutlineRect(ctx, 12, 40, 10, 6, '#e74c3c');
        this.drawOutlineRect(ctx, 26, 40, 10, 6, '#e74c3c');
      } else if (pose === 'kick') {
        this.drawOutlineRect(ctx, 28, 18, 16, 8, '#2980b9');
        this.drawOutlineRect(ctx, 40, 16, 8, 12, '#e74c3c');
        this.drawOutlineRect(ctx, 14, 38, 8, 8, '#e74c3c');
      } else if (pose === 'heavy') {
        // Flame Punch
        this.drawOutlineRect(ctx, 24, 4, 18, 10, '#ff6b81');
        ctx.fillStyle = '#ffa502';
        ctx.fillRect(38, 0, 10, 12);
        this.drawOutlineRect(ctx, 14, 38, 20, 8, '#2980b9');
      } else if (pose === 'hurt') {
        this.drawOutlineRect(ctx, 10, 22, 20, 16, '#e74c3c');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 14, 8, 8);
      } else if (pose === 'victory') {
        this.drawOutlineRect(ctx, 10, 10, 6, 14, '#ffccaa');
        this.drawOutlineRect(ctx, 32, 10, 6, 14, '#ffccaa');
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(10, 4, 6, 6);
        ctx.fillRect(32, 4, 6, 6);
      }

      ctx.restore();
    };

    drawScottFrame(0, 0, 'idle');
    drawScottFrame(1, 0, 'walk1');
    drawScottFrame(2, 0, 'walk2');
    drawScottFrame(3, 0, 'walk3');

    drawScottFrame(0, 1, 'punch');
    drawScottFrame(1, 1, 'kick');
    drawScottFrame(2, 1, 'heavy');
    drawScottFrame(3, 1, 'hurt');

    drawScottFrame(0, 2, 'walk1');
    drawScottFrame(1, 2, 'walk3');
    drawScottFrame(2, 2, 'punch');
    drawScottFrame(3, 2, 'victory');

    for (let i = 0; i < 12; i++) {
      canvas.add(i, 0, (i % 4) * 48, Math.floor(i / 4) * 48, 48, 48);
    }
    canvas.refresh();

    scene.anims.create({
      key: 'alex_idle',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'alex_walk',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'alex_punch',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 4, end: 4 }),
      frameRate: 10,
      repeat: 0
    });

    scene.anims.create({
      key: 'alex_kick',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 5, end: 5 }),
      frameRate: 10,
      repeat: 0
    });

    scene.anims.create({
      key: 'alex_heavy',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 6, end: 6 }),
      frameRate: 8,
      repeat: 0
    });

    scene.anims.create({
      key: 'alex_hurt',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 7, end: 7 }),
      frameRate: 5,
      repeat: 0
    });

    scene.anims.create({
      key: 'alex_victory',
      frames: scene.anims.generateFrameNumbers('alex_ryder', { start: 11, end: 11 }),
      frameRate: 5,
      repeat: -1
    });
  }

  static createRamonaTextures(scene) {
    if (scene.textures.exists('ramona_flowers')) return;

    const canvas = scene.textures.createCanvas('ramona_flowers', 48, 48);
    const ctx = canvas.context;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(24, 44, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bright Pink Hair & Goggles
    this.drawOutlineRect(ctx, 14, 4, 20, 12, '#ff0080');
    this.drawOutlineRect(ctx, 18, 6, 12, 4, '#f1c40f'); // Goggles

    // Head
    this.drawOutlineRect(ctx, 16, 14, 16, 10, '#ffeaa7');

    // Blue Jacket & Star Bag
    this.drawOutlineRect(ctx, 14, 24, 20, 14, '#00d2d3');
    this.drawOutlineRect(ctx, 28, 26, 8, 8, '#feca57'); // Subspace Bag

    // Skirt / Boots
    this.drawOutlineRect(ctx, 16, 38, 16, 6, '#2d3436');
    this.drawOutlineRect(ctx, 14, 42, 8, 6, '#ff0080');
    this.drawOutlineRect(ctx, 26, 42, 8, 6, '#ff0080');

    canvas.refresh();
  }

  static createEnemyTextures(scene) {
    const types = [
      { key: 'street_punk', jacket: '#2e86de', hair: '#ff9f43' },
      { key: 'runner', jacket: '#ee5253', hair: '#00d2d3' },
      { key: 'bruiser', jacket: '#5f27cd', hair: '#54a0ff', scale: 1.3 },
      { key: 'ranged', jacket: '#10ac84', hair: '#ff9ff3' }
    ];

    types.forEach(t => {
      if (scene.textures.exists(t.key)) return;
      const canvas = scene.textures.createCanvas(t.key, 192, 48);
      const ctx = canvas.context;

      for (let col = 0; col < 4; col++) {
        ctx.save();
        ctx.translate(col * 48, 0);

        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(24, 44, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        this.drawOutlineRect(ctx, 16, 6, 16, 8, t.hair);
        this.drawOutlineRect(ctx, 16, 12, 16, 10, '#f5cd79');
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(24, 15, 4, 3);

        this.drawOutlineRect(ctx, 14, 22, 20, 16, t.jacket);
        this.drawOutlineRect(ctx, 16, 38, 16, 6, '#303952');

        if (col === 2) {
          this.drawOutlineRect(ctx, 32, 20, 14, 8, '#e74c3c');
        } else if (col === 3) {
          this.drawOutlineRect(ctx, 12, 20, 20, 16, '#ff4d4d');
        }

        ctx.restore();
      }

      for (let i = 0; i < 4; i++) {
        canvas.add(i, 0, i * 48, 0, 48, 48);
      }
      canvas.refresh();
    });
  }

  static createBossTextures(scene) {
    const bosses = [
      { key: 'matthew_patel', mainColor: '#2d3436', accent: '#e74c3c' },
      { key: 'lucas_lee', mainColor: '#d35400', accent: '#f39c12' },
      { key: 'roxie_richter', mainColor: '#8e44ad', accent: '#ff0080' },
      { key: 'todd_ingram', mainColor: '#ffffff', accent: '#00f0ff' },
      { key: 'katayanagi_twins', mainColor: '#2ecc71', accent: '#1abc9c' },
      { key: 'nega_scott', mainColor: '#2c3e50', accent: '#8e44ad' },
      { key: 'gideon_graves', mainColor: '#ffffff', accent: '#ff0055' }
    ];

    bosses.forEach(b => {
      if (scene.textures.exists(b.key)) return;
      const canvas = scene.textures.createCanvas(b.key, 256, 64);
      const ctx = canvas.context;

      for (let col = 0; col < 4; col++) {
        ctx.save();
        ctx.translate(col * 64, 0);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(32, 60, 20, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        this.drawOutlineRect(ctx, 20, 4, 24, 12, b.accent);
        this.drawOutlineRect(ctx, 20, 14, 24, 14, '#ffeaa7');

        ctx.fillStyle = b.mainColor;
        ctx.fillRect(32, 18, 8, 4);

        this.drawOutlineRect(ctx, 16, 28, 32, 22, b.mainColor);
        this.drawOutlineRect(ctx, 20, 50, 24, 10, '#2d3436');

        if (col === 2) {
          this.drawOutlineRect(ctx, 42, 24, 20, 14, b.accent);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(56, 20, 8, 20);
        } else if (col === 3) {
          this.drawOutlineRect(ctx, 16, 26, 32, 22, '#ff4757');
        }

        ctx.restore();
      }

      for (let i = 0; i < 4; i++) {
        canvas.add(i, 0, i * 64, 0, 64, 64);
      }
      canvas.refresh();
    });
  }

  static createEffectTextures(scene) {
    if (!scene.textures.exists('projectile_bolt')) {
      const canvas = scene.textures.createCanvas('projectile_bolt', 16, 16);
      const ctx = canvas.context;
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(8, 8, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, 8, 4, 0, Math.PI * 2);
      ctx.fill();
      canvas.refresh();
    }

    if (!scene.textures.exists('particle_spark')) {
      const canvas = scene.textures.createCanvas('particle_spark', 8, 8);
      const ctx = canvas.context;
      ctx.fillStyle = '#fffa65';
      ctx.fillRect(0, 0, 8, 8);
      canvas.refresh();
    }

    if (!scene.textures.exists('soundwave_ring')) {
      const canvas = scene.textures.createCanvas('soundwave_ring', 32, 32);
      const ctx = canvas.context;
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(16, 16, 13, 0, Math.PI * 2);
      ctx.stroke();
      canvas.refresh();
    }
  }

  static createPickupTextures(scene) {
    if (!scene.textures.exists('pickup_health')) {
      const canvas = scene.textures.createCanvas('pickup_health', 16, 16);
      const ctx = canvas.context;
      this.drawOutlineRect(ctx, 2, 4, 12, 10, '#ff4757');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, 2, 4, 12);
      ctx.fillRect(2, 6, 12, 4);
      canvas.refresh();
    }

    if (!scene.textures.exists('pickup_energy')) {
      const canvas = scene.textures.createCanvas('pickup_energy', 16, 16);
      const ctx = canvas.context;
      ctx.fillStyle = '#00d2d3';
      ctx.beginPath();
      ctx.moveTo(9, 1);
      ctx.lineTo(3, 9);
      ctx.lineTo(8, 9);
      ctx.lineTo(7, 15);
      ctx.lineTo(13, 7);
      ctx.lineTo(8, 7);
      ctx.closePath();
      ctx.fill();
      canvas.refresh();
    }

    if (!scene.textures.exists('pickup_coin')) {
      const canvas = scene.textures.createCanvas('pickup_coin', 16, 16);
      const ctx = canvas.context;
      ctx.fillStyle = '#feca57';
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff9f43';
      ctx.lineWidth = 2;
      ctx.stroke();
      canvas.refresh();
    }

    if (!scene.textures.exists('pickup_xp')) {
      const canvas = scene.textures.createCanvas('pickup_xp', 16, 16);
      const ctx = canvas.context;
      ctx.fillStyle = '#54a0ff';
      ctx.beginPath();
      ctx.moveTo(8, 1);
      ctx.lineTo(15, 8);
      ctx.lineTo(8, 15);
      ctx.lineTo(1, 8);
      ctx.closePath();
      ctx.fill();
      canvas.refresh();
    }
  }

  static createEnvironmentTextures(scene) {
    if (!scene.textures.exists('tile_platform')) {
      const canvas = scene.textures.createCanvas('tile_platform', 64, 32);
      const ctx = canvas.context;
      this.drawOutlineRect(ctx, 0, 0, 64, 32, '#2c3e50', '#00f0ff', 2);
      ctx.fillStyle = '#34495e';
      ctx.fillRect(4, 4, 56, 4);
      canvas.refresh();
    }

    if (!scene.textures.exists('bg_parallax_city')) {
      const canvas = scene.textures.createCanvas('bg_parallax_city', 960, 540);
      const ctx = canvas.context;

      const grad = ctx.createLinearGradient(0, 0, 0, 540);
      grad.addColorStop(0, '#0a0915');
      grad.addColorStop(0.6, '#181438');
      grad.addColorStop(1, '#2d124d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 960, 540);

      ctx.fillStyle = '#100c24';
      for (let i = 0; i < 12; i++) {
        const bw = 60 + Math.random() * 50;
        const bh = 150 + Math.random() * 200;
        const bx = i * 80;
        const by = 540 - bh;
        ctx.fillRect(bx, by, bw, bh);

        ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#ff0080';
        for (let wy = by + 20; wy < 500; wy += 25) {
          for (let wx = bx + 10; wx < bx + bw - 15; wx += 20) {
            if (Math.random() > 0.4) {
              ctx.fillRect(wx, wy, 8, 12);
            }
          }
        }
        ctx.fillStyle = '#100c24';
      }

      ctx.fillStyle = '#0d091a';
      ctx.fillRect(0, 440, 960, 100);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(0, 440, 960, 4);

      canvas.refresh();
    }
  }
}
