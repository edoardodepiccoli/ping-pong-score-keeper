//game logic
const game = {
  maxScore: 11,

  player1Score: 0,
  player2Score: 0,

  player1TieScore: 0,
  player2TieScore: 0,

  serveTurn: 0,
  finished: 0,

  increasePlayer1Score: function () {
    this.player1Score++;
    this.checkServeTurn();
    this.checkFinished();
  },
  increasePlayer2Score: function () {
    this.player2Score++;
    this.checkServeTurn();
    this.checkFinished();
  },

  checkServeTurn: function () {
    //check if playing tie
    if (this.checkTie()) {
      this.serveTurn = this.serveTurn == 0 ? 1 : 0;
    }
    // if not playing tie continue normally
    else {
      if (this.maxScore == 11) {
        if ((this.player1Score + this.player2Score) % 3 == 0) {
          this.serveTurn = this.serveTurn == 0 ? 1 : 0;
        }
      } else if (this.maxScore == 21) {
        if ((this.player1Score + this.player2Score) % 5 == 0) {
          this.serveTurn = this.serveTurn == 0 ? 1 : 0;
        }
      }
    }
  },

  checkTie: function () {
    return (
      this.player1Score >= this.maxScore - 1 &&
      this.player2Score >= this.maxScore - 1
    );
  },

  checkFinished: function () {
    if (!this.checkTie()) {
      console.log(`p1 is ${this.player1Score}, p2 is ${this.player2Score}`);
      console.log(`turn is ${this.serveTurn}`);
      if (
        this.player1Score == this.maxScore ||
        this.player2Score == this.maxScore
      ) {
        console.log("finished");
        this.finished = 1;
      }
    } else {
      console.log(
        `we are playing tie, p1 is ${this.player1Score}, p2 is ${this.player2Score}`
      );
      console.log(`turn is ${this.serveTurn}`);

      if (this.player1Score == this.player2Score) {
        this.player1TieScore = 0;
        this.player2TieScore = 0;
      } else {
        if (this.player1Score > this.player2Score) {
          this.player1TieScore = 1;
        } else {
          this.player2TieScore = 1;
        }
      }

      if (
        this.player1Score >= this.player2Score + 2 ||
        this.player2Score >= this.player1Score + 2
      ) {
        console.log("finished");
        this.finished = 1;
      }
    }
  },

  reset: function () {
    this.player1Score = 0;
    this.player2Score = 0;
    this.serveTurn = 0;
    this.finished = 0;
  },
};

//ui elements
//fix click on scroll behaviour

document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

document
  .getElementById(".score-keeper-div.player1")
  .addEventListener("touchend", function (event) {
    event.preventDefault();
    event.target.click();
  });
document
  .getElementById(".score-keeper-div.player2")
  .addEventListener("touchend", function (event) {
    event.preventDefault();
    event.target.click();
  });

document.body.addEventListener(
  "touchmove",
  function (event) {
    if (!event.target.closest("#scrollableDiv")) {
      event.preventDefault();
    }
  },
  { passive: false }
);

//other stuff

const winningScreen = document.querySelector(".winning-screen");
winningScreen.addEventListener("click", () => {
  game.reset();
  refreshUI();

  winningScreen.classList.add("hidden");
});

const select11Points = document.querySelector("#points-11-button");
const select21Points = document.querySelector("#points-21-button");

select11Points.addEventListener("click", () => {
  game.reset();
  game.maxScore = 11;
  refreshUI();

  if (select21Points.classList.contains("active"))
    select21Points.classList.remove("active");
  if (!select11Points.classList.contains("active"))
    select11Points.classList.add("active");
});

select21Points.addEventListener("click", () => {
  game.reset();
  game.maxScore = 21;
  refreshUI();

  if (select11Points.classList.contains("active"))
    select11Points.classList.remove("active");
  if (!select21Points.classList.contains("active"))
    select21Points.classList.add("active");
});

const player1Button = document.querySelector(".score-keeper-div.player1");
const player1ButtonText = document.querySelector(".score-keeper-div.player1 p");
const player1ButtonImg = document.querySelector(
  ".score-keeper-div.player1 img"
);
player1Button.addEventListener("click", () => {
  game.increasePlayer1Score(); // this check if finished
  refreshUI();
});

const player2Button = document.querySelector(".score-keeper-div.player2");
const player2ButtonText = document.querySelector(".score-keeper-div.player2 p");
const player2ButtonImg = document.querySelector(
  ".score-keeper-div.player2 img"
);
player2Button.addEventListener("click", () => {
  game.increasePlayer2Score(); // this check if finished
  refreshUI();
});

function resetServeImages() {
  if (player1ButtonImg.classList.contains("hidden")) {
    player1ButtonImg.classList.remove("hidden");
  }
  if (player2ButtonImg.classList.contains("hidden")) {
    player2ButtonImg.classList.remove("hidden");
  }
}

function refreshUI() {
  player1ButtonText.innerHTML = game.player1Score;
  player2ButtonText.innerHTML = game.player2Score;

  if (game.checkTie()) {
    player1ButtonText.innerHTML = "+" + game.player1TieScore;
    player2ButtonText.innerHTML = "+" + game.player2TieScore;
  }

  if (game.serveTurn == 0) {
    resetServeImages();
    player2ButtonImg.classList.add("hidden");
  } else {
    resetServeImages();
    player1ButtonImg.classList.add("hidden");
  }

  if (game.finished) {
    console.log("finished from UI");

    //se vince p1 blue
    if (game.player1Score > game.player2Score) {
      console.log("player 1 wins");

      winningScreenH1 = document.querySelector(".winning-screen h1");
      winningScreenH1.innerHTML = "Player 1 Wins!";
      winningScreenP = document.querySelector(".winning-screen p");
      winningScreenP.innerHTML = "Click to restart";

      winningScreen.style.backgroundColor = "#768cff";
    }
    //se vince p2 red
    else {
      console.log("player 2 wins");

      winningScreenH1 = document.querySelector(".winning-screen h1");
      winningScreenH1.innerHTML = "Player 2 Wins!";
      winningScreenP = document.querySelector(".winning-screen p");
      winningScreenP.innerHTML = "Click to restart";

      winningScreen.style.backgroundColor = "#ffa7a7";
    }

    winningScreen.classList.remove("hidden");
  }
}
