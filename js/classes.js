class Sprite {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.width = 80;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}

class Hero {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 80;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset,
      width: 180,
      height: 100,
    };
    this.color = color;
    this.isAttacking;
    this.isJumping;
    this.jumpCount = 0;
    this.heroHealth = 3;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, 80, this.height);

    // drawing the attack box

    if (this.isAttacking) {
      ctx.fillStyle = "pink";
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    // attack box to stay with character
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

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
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

class Enemy {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 80;
    this.height = 70;
    this.lastKey;
    this.isAlive = true;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset,
      width: 70,
      height: 50,
    };

    this.color = color;
    this.inRange = false;
    this.isAttacking;
    this.canAttack = true;
    this.isJumping;
    this.jumpCount = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, 80, this.height);

    // drawing the attack box
    if (this.isAttacking) {
      ctx.fillStyle = "pink";
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attack();

    // attack box to stay with character
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity fall check in else, ground detection in if
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 45) {
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
      if (this.position.x - timmy.position.x <= 200) {
        this.inRange = true;
        this.isAttacking = true;
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

    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 1000);
  }
}
