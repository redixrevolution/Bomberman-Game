import { BombermanGame } from "game/BombermanGame.js";
const startBtn = document.getElementById("startBtn");
const exitBtn = document.getElementById("exitBtn");
const restartBtn = document.getElementById("restartBtn");


export function startNewGame() {
	const game = new BombermanGame(false);  // Passing false to indicate not to load from localStorage
	game.start();
	hideGameMenu();
}

export function continueGame() {
	const game = new BombermanGame(true);  // Passing true to indicate loading from localStorage
	game.start();
	hideGameMenu();
}

window.addEventListener("load", () => {
	startBtn.onclick = startNewGame;
	continueBtn.onclick = continueGame;
	restartBtn.onclick = startNewGame; // Same as "start", resets the game

	exitBtn.onclick = function () {
		window.close();
	};
});


//ADDED-export
export function showGameMenu() {
	const gameMenu = document.querySelector(".game-menu");
	gameMenu.style.display = "flex";

}//ADDED-export
export function hideGameMenu() {
	const gameMenu = document.querySelector(".game-menu");
	gameMenu.style.display = "none";

}
window.addEventListener("load", () => {
	startBtn.onclick = function () {
		new BombermanGame().start();
		hideGameMenu()
	};
	exitBtn.onclick = function () {
		window.close();
	};
	restartBtn.onclick = function () {
		new BombermanGame().start();
		hideGameMenu()
	};

});
