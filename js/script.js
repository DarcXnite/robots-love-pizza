const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.4;

const randNum = () => {
  return Math.floor(Math.random() * 400 + 50);
};

class Image {
  constructor({ position, velocity, color = "red", offset }) {
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
  }

  draw() {}

  update() {
    this.draw();
  }
}

class Hero {
  constructor({ position, velocity, color = "red", offset }) {
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
    ctx.fillStyle = "red";
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
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
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
    ctx.fillStyle = "yellow";
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
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
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
      if (this.position.x - timmy.position.x < 200) {
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

const timmy = new Hero({
  position: { x: 100, y: 400 },
  velocity: { x: 0, y: 0 },
  color: "red",
  offset: { x: 50, y: 20 },
});
// timmy.draw();

const drone = new Enemy({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "yellow",
  offset: { x: 75, y: 0 },
});
// drone.draw();

console.log(timmy);

const keys = {
  ArrowUp: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

let lastKey;

const attackBoxCollision = ({ rect1, rect2 }) => {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
};

const drones = [];

const spawnDrone = () => {
  setInterval(() => {
    drones.push(
      new Enemy({
        position: { x: 900, y: randNum() },
        velocity: { x: 0, y: 0 },
        color: "yellow",
        offset: { x: 75, y: 0 },
      })
    );
    // console.log(drones);
  }, 3000);
};

let heroHealth = 3;

// runs the refresh loop just like gameloop
const animate = () => {
  window.requestAnimationFrame(animate);
  if (heroHealth <= 0) {
    return;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  timmy.update();
  // drone.update();

  // spawn drones
  drones.forEach((drone, index) => {
    drone.update();

    // attack collision detection
    if (
      attackBoxCollision({ rect1: timmy, rect2: drone }) &&
      timmy.isAttacking
    ) {
      // ensure that only 1 hit per attack press
      timmy.isAttacking = false;
      drone.isAlive = false;
      if (!drone.isAlive) {
        console.log("destroyed");
        drones.splice(index, 1);
      }
      console.log("attacking");
    }

    // enemy attack collision detecton
    if (
      attackBoxCollision({ rect1: drone, rect2: timmy }) &&
      drone.isAttacking
    ) {
      // ensure that only 1 hit per attack press
      drone.isAttacking = false;
      heroHealth--;
      document.querySelector("#heroHealth").innerText = heroHealth;
    }

    if (drone.inRange) {
      drone.velocity.x = 0;
      return;
    } else {
      if (timmy.position.x <= drone.position.x) {
        drone.position.x -= 2;
      }

      if (timmy.position.x >= drone.position.x) {
        drone.position.x += 2;
      }
    }

    if (timmy.velocity.y < 0) {
      drone.velocity.y = -7;
    }
  });

  // resets movement so sprite doesnt continuiously move
  timmy.velocity.x = 0;

  // movement checker, so the last key pressed will be the newest movement detected
  if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    timmy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    timmy.velocity.x = 5;
  }

  // attack collision detection
  // if (attackBoxCollision({ rect1: timmy, rect2: drone }) && timmy.isAttacking) {
  //   // ensure that only 1 hit per attack press
  //   timmy.isAttacking = false;
  //   drone.isAlive = false;
  //   if (!drone.isAlive) {
  //     console.log("destroyed");
  //   }
  //   console.log("attacking");
  // }

  // enemy attack collision detecton
  if (attackBoxCollision({ rect1: drone, rect2: timmy }) && drone.isAttacking) {
    // ensure that only 1 hit per attack press
    drone.isAttacking = false;
    heroHealth--;
    document.querySelector("#heroHealth").innerText = heroHealth;
  }
};

animate();
spawnDrone();

const actionsHandler = (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "s":
      timmy.isJumping === true;
      timmy.jumpCount++;
      timmy.velocity.y = -10;
      console.log(timmy.isJumping);
      console.log(timmy.jumpCount);

      break;
    // case "ArrowDown":
    //   timmy.position.y += speed;

    //   break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      lastKey = "ArrowLeft";

      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      lastKey = "ArrowRight";

      break;
    case "a":
      timmy.attack();
      break;
    default:
      break;
  }
};

const actionsEnder = (e) => {
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;

      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;

      break;

    case "ArrowUp":
    case "s":
      keys.ArrowUp.pressed = false;
      break;
    default:
      break;
  }
};

document.addEventListener("keydown", actionsHandler);
document.addEventListener("keyup", actionsEnder);
