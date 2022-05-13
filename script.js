const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.querySelector("#startGame");

let gameState = false;
let jumpAudio = new Audio("./audio/Jump2.wav");
let killAudio = new Audio("./audio/Explosion2.wav");
let hitTakenAduio = new Audio("./audio/Hit_Hurt3.wav");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.4;

const randNum = () => {
  return Math.floor(Math.random() * 400 + 50);
};

const bgMusic = () => {
  let audio = new Audio("./audio/dark-dragon.mp3");
  audio.play();
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/bg.png",
});

const timmy = new Hero({
  position: { x: 120, y: 200 },
  velocity: { x: 0, y: 0 },
  color: "red",
  offset: { x: 50, y: 20 },
  imageSrc: "./images/sprites/timmy-idle.png",
  framesMax: 6,
  scale: 3,
  offset: {
    x: 55,
    y: 153,
  },
  sprites: {
    idle: {
      imageSrc: "./images/sprites/timmy-idle.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./images/sprites/timmy-run.png",
      framesMax: 6,
    },
    attack: {
      imageSrc: "./images/sprites/timmy-attack.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 75,
      y: 0,
    },
    width: 100,
    height: 70,
  },
});

const drone = new Enemy({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "yellow",
  offset: { x: 75, y: 0 },
  imageSrc: "./images/sprites/droid-right2left.png",
  framesMax: 6,
  scale: 2,
  offset: {
    x: 55,
    y: 53,
  },
  sprites: {
    idle: {
      imageSrc: "./images/sprites/droid-right2left.png",
      framesMax: 6,
    },
    attack: {
      imageSrc: "./images/sprites/droid-attack-right2left.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 55,
      y: 0,
    },
    width: 70,
    height: 50,
  },
});

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
        imageSrc: "./images/sprites/droid-right2left.png",
        framesMax: 6,
        scale: 2,
        offset: {
          x: 55,
          y: 53,
        },
        sprites: {
          idle: {
            imageSrc: "./images/sprites/droid-right2left.png",
            framesMax: 6,
          },
          attack: {
            imageSrc: "./images/sprites/droid-attack-right2left.png",
            framesMax: 6,
          },
        },
        attackBox: {
          offset: {
            x: 55,
            y: 0,
          },
          width: 70,
          height: 50,
        },
      })
    );
    // console.log(drones);
  }, 1600);
};

let heroHealth = 3;
let killCount = 0;

const startGame = () => {
  gameState = true;
  heroHealth = 3;
  killCount = 0;
  animate();
  spawnDrone();
};

// runs the refresh loop just like gameloop
const animate = () => {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  if (heroHealth <= 0) {
    gameState === false;
    const loserScreen = document.querySelector(".loserScreen");
    loserScreen.classList.remove("display-none");
    document.querySelector(".loserScreen").classList.remove("display-none");
    document.querySelector("#restartGame").addEventListener("click", () => {
      window.location.reload();
      // loserScreen.classList.add("display-none");
    });
    return;
  }

  if (killCount === 20) {
    gameState === false;
    const winnerScreen = document.querySelector(".winnerScreen");
    winnerScreen.classList.remove("display-none");
    document
      .querySelector("#winnerRestartGame")
      .addEventListener("click", () => {
        window.location.reload();
        // winnerScreen.classList.add("display-none");
      });
    return;
  }

  if (!gameState) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
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
        killAudio.play();
        killCount++;
        drones.splice(index, 1);
        document.querySelector("#killCount").innerText = killCount;
      }
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
      const droneJumps = setTimeout(() => {
        drone.velocity.y = -7;
      }, 800);
    }
  });

  // resets movement so sprite doesnt continuiously move
  timmy.velocity.x = 0;

  // movement checker, so the last key pressed will be the newest movement detected

  if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    timmy.velocity.x = -5;
    timmy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    timmy.velocity.x = 5;
    timmy.switchSprite("run");
  } else {
    timmy.switchSprite("idle");
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
    hitTakenAduio.play();
    heroHealth--;
    document.querySelector("#heroHealth").innerText = heroHealth;
  }
};

startBtn.addEventListener("click", () => {
  startGame();
  bgMusic();
  document.querySelector(".instructions").classList.add("display-none");
});

const actionsHandler = (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "s":
      jumpAudio.play();
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
