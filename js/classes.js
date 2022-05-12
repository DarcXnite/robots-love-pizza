class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 80;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}

class Hero extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 70;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.isJumping;
    this.jumpCount = 0;
    this.heroHealth = 3;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }

    // attack box to stay with character
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draws out the square for the player
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.position.x, this.position.y, 80, this.height);

    // draws out the attack box
    // ctx.fillStyle = "pink";
    // ctx.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // movement calculation
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity fall check in else, ground detection in if
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 45) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    // left side detection // kind of working
    if (this.position.x + this.width + this.velocity.x === 0) {
      this.velocity.x = 0;
      console.log("hit left wall");
    }

    // right wall detection
    if (this.position.x + this.width + this.velocity.x >= canvas.width) {
      this.velocity.x = 0;
      console.log("hit right wall");
    }
  }

  attack() {
    this.switchSprite("attack");
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    ) {
      return;
    }
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack":
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesMax = this.sprites.attack.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "damage":
        break;
      case "death":
        break;

      default:
        break;
    }
  }
}

class Enemy extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.position = position;
    this.velocity = velocity;
    this.width = 30;
    this.height = 40;
    this.lastKey;
    this.isAlive = true;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };

    this.color = color;
    this.inRange = false;
    this.isAttacking;
    this.canAttack = true;
    this.isJumping;
    this.jumpCount = 0;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  // draw() {
  //   ctx.fillStyle = this.color;
  //   ctx.fillRect(this.position.x, this.position.y, 80, this.height);

  //   // drawing the attack box
  //   if (this.isAttacking) {
  //     ctx.fillStyle = "pink";
  //     ctx.fillRect(
  //       this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     );
  //   }
  // }

  update() {
    this.draw();
    this.attack();
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }

    // draws out enemy
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, 80, this.height);

    // draws out enemy attack box
    // ctx.fillStyle = "pink";
    // ctx.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // attack box to stay with character
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity fall check in else, ground detection in if
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 50) {
      this.velocity.y = 0;
      this.isJumping = false;
      this.jumpCount = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    if (this.canAttack) {
      this.canAttack = false;
      if (this.position.x - timmy.position.x <= 175) {
        this.inRange = true;
        this.isAttacking = true;
        if (this.isAttacking) {
          this.switchSprite("attack");
        }
        setTimeout(() => {
          this.isAttacking = false;
        }, 2000);
      } else {
        this.isAttacking = false;
      }

      setTimeout(() => {
        this.canAttack = true;
        this.inRange = false;
      }, 2500);
    }
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    ) {
      return;
    }
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack":
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesMax = this.sprites.attack.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "damage":
        break;
      case "death":
        break;

      default:
        break;
    }
  }
}
