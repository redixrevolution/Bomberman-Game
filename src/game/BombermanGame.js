import {
	MAX_WINS,
	NO_PLAYERS,
	SCREEN_HEIGHT,
	SCREEN_WIDTH
} from "game/constants/game.js";
import { Game } from "engine/Game.js";
import { BattleScene } from "./scenes/BattleScene.js";
import { clamp } from "engine/utils/maths.js";
import { showGameMenu } from "../index.js";


export class BombermanGame extends Game {
	gameState = {
		wins: new Array(clamp(NO_PLAYERS, 2, 5)).fill(0),
		maxWins: MAX_WINS,
	};

	constructor(loadSavedGame = false) {
		super("body", SCREEN_WIDTH, SCREEN_HEIGHT);
		if (loadSavedGame) {
			this.loadWins();
		}
		this.scene = new BattleScene(
			this.frameTime,
			this.camera,
			this.gameState,
			this.resetGame
		);
	}

	resetWins() {
		this.gameState.wins.fill(0);
		this.saveWins();
	}

	saveWins() {
		localStorage.setItem('playerWins', JSON.stringify(this.gameState.wins));
	}

	loadWins() {
		const savedWins = localStorage.getItem('playerWins');
		if (savedWins) {
			this.gameState.wins = JSON.parse(savedWins);
		}
	}


	resetGame = (winnerId) => {
		if (winnerId > -1) {
			this.gameState.wins[winnerId] += 1;
			this.saveWins();  // Save every time the game state changes
		}

		if (this.gameState.wins.some(win => win >= this.gameState.maxWins)) {
			this.endGame();
		} else {
			this.scene = new BattleScene(
				this.frameTime,
				this.camera,
				this.gameState,
				this.resetGame
			);
		}
	}

	endGame = () => {
		this.scene = null;
		this.stop();
		const canvas = document.querySelector('canvas');
		canvas.remove();
		document.getElementById('restartBtn').style.display = "block";
		document.getElementById('startBtn').style.display = "none";
		showGameMenu();
	}
}
