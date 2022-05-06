const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, 80, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity fall check in else, ground detection in if
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const timmy = new Sprite({
  position: { x: 480, y: 300 },
  velocity: { x: 0, y: 0 },
});
// timmy.draw();

const drone = new Sprite({
  position: { x: 400, y: 0 },
  velocity: { x: 0, y: 0 },
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

// runs the refresh loop just like gameloop
const animate = () => {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  timmy.update();
  //   drone.update();

  // resets movement so sprite doesnt continuiously move
  timmy.velocity.x = 0;

  // movement checker, so the last key pressed will be the newest movement detected
  if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    timmy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    timmy.velocity.x = 5;
  }
};

animate();

const actionsHandler = (e) => {
  switch (e.key) {
    case "ArrowUp":
    case " ":
      timmy.velocity.y = -10;

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
      console.log("attack");
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
    case " ":
      keys.ArrowUp.pressed = false;
      break;
    default:
      break;
  }
};

document.addEventListener("keydown", actionsHandler);
document.addEventListener("keyup", actionsEnder);
