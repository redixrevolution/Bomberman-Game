import { Entity } from "engine/Entity.js";
import { SCREEN_WIDTH, STAGE_OFFSET_Y } from "game/constants/game.js";
import { drawText } from "game/utils/drawText.js";

export class BattleHud extends Entity {
	image = document.querySelector("img#hud");

	clock = [3, 0]; // minutes and seconds(3 mins 0 seconds)

	constructor(time, state) {
		super({ x: 0, y: 0 });
		this.state = state;
		this.clockTimer = time.previous + 1000; // 1000 miliseconds = 1 second
	}

	updateClock(time) {
		if (time.previous < this.clockTimer) return;

		this.clock[1] -= 1;
		this.clockTimer = time.previous + 1000;

		if (this.clock[1] < 0 && this.clock[0] > 0) {
			this.clock[0] -= 1;
			this.clock[1] = 59;
		}
	}

	update(time, context, camera) {
		this.updateClock(time);
	}

	draw(context, camera) {
		context.drawImage(
			this.image,
			8, 40, SCREEN_WIDTH, STAGE_OFFSET_Y,
			0, 0, SCREEN_WIDTH, STAGE_OFFSET_Y
		);

		drawText(context, `${String(this.clock[0])}:${String(this.clock[1]).padStart(2, '0')}`, 32, 8);

		for (const id in this.state.wins) {
			drawText(context, String(this.state.wins[id]), 104 + (id * 32), 8, 8);
		}
	}
}

