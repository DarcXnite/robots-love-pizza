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

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const timmy = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
});
// timmy.draw();

const drone = new Sprite({
  position: { x: 400, y: 0 },
  velocity: { x: 0, y: 0 },
});
// drone.draw();

console.log(timmy);

function actionsHandler(e) {
  const speed = 30;
  switch (e.key) {
    case "ArrowUp":
    case " ":
      console.log("jump");

      break;
    // case "ArrowDown":
    //   timmy.position.y += speed;

    //   break;
    case "ArrowLeft":
      timmy.position.x -= speed;

      break;
    case "ArrowRight":
      timmy.position.x += speed;

      break;
    case "a":
      console.log("attack");
      break;
    default:
      break;
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  timmy.update();
  drone.update();
}

animate();

document.addEventListener("keydown", actionsHandler);
