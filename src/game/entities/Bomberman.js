import { Entity } from "engine/Entity.js";
import { drawFrameOrigin } from "engine/context.js";
import * as control from "engine/inputHandler.js";
import {
	WALK_SPEED,
	BombermanStateType,
	BombermanPlayerData,
	animations,
	getBombermanFrames,
} from "game/constants/bomberman.js";
import { DEBUG, FRAME_TIME, HALF_TILE_SIZE, TILE_SIZE } from "game/constants/game.js";
import { CounterDirectionsLookup, Direction, MovementLookup } from "game/constants/entities.js";
import { CollisionTile } from "game/constants/levelData.js";
import { Control } from "game/constants/controls.js";
import { drawBox, drawCross } from "game/utils/debug.js";
import { isZero } from "game/utils/utils.js";

export class Bomberman extends Entity {
	image = document.querySelector("img#bomberman");

	id = 0;
	direction = Direction.DOWN;
	baseSpeedTime = WALK_SPEED;
	SpeedMultiplier = 1.2;
	animation = animations.moveAnimations[this.direction];

	bombAmount = 1;
	bombStrength = 1;
	availableBombs = this.bombAmount;
	lastBombCell = undefined;

	constructor(id, time, getStageCollisionTileAt, onBombPlaced, onEnd) {
		// Calculation for starting position
		super({
			x: (BombermanPlayerData[id].column * TILE_SIZE) + HALF_TILE_SIZE,
			y: (BombermanPlayerData[id].row * TILE_SIZE) + HALF_TILE_SIZE,
		});

		this.states = {
			[BombermanStateType.IDLE]: {
				type: BombermanStateType.IDLE,
				init: this.handleIdleInit,
				update: this.handleIdleState,
			},
			[BombermanStateType.MOVING]: {
				type: BombermanStateType.MOVING,
				init: this.handleMovingInit,
				update: this.handleMovingState,
			},
			[BombermanStateType.DEATH]: {
				type: BombermanStateType.DEATH,
				init: this.handleDeathInit,
				update: this.handleDeathState,
			},
		};
		this.id = id;
		this.color = BombermanPlayerData[id].color;
		this.frames = getBombermanFrames(this.color);
		this.startPosition = { ...this.position };
		this.getStageCollisionTileAt = getStageCollisionTileAt; //passing collision map as a reference
		this.onBombPlaced = onBombPlaced;
		this.onEnd = onEnd;

		this.changeState(BombermanStateType.IDLE, time);
	}

	changeState(newState, time) {
		this.currentState = this.states[newState];
		this.animationFrame = 0;

		this.currentState.init(time);
		this.animationTimer =
			time.previous + this.animation[this.animationFrame][1] * FRAME_TIME;
	}

	resetVelocity = () => {
		this.velocity.x = 0;
		this.velocity.y = 0;

	}

	getCollisionRect = () => ({
		x: this.position.x - (HALF_TILE_SIZE / 2), y: this.position.y - (HALF_TILE_SIZE / 2),
		width: HALF_TILE_SIZE, height: HALF_TILE_SIZE,
	});

	getCollisionTile(cell) {
		if (
			this.lastBombCell &&
			cell.row === this.lastBombCell.row &&
			cell.column === this.lastBombCell.column
		)
			return CollisionTile.EMPTY;
		return this.getStageCollisionTileAt(cell);
	}

	getCollisionCoords(direction) {
		switch (direction) {
			case Direction.UP:
				return [
					{
						row: Math.floor((this.position.y - 9) / TILE_SIZE),
						column: Math.floor((this.position.x - 8) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y - 9) / TILE_SIZE),
						column: Math.floor((this.position.x + 7) / TILE_SIZE),
					},
				];
			case Direction.LEFT:
				return [
					{
						row: Math.floor((this.position.y - 8) / TILE_SIZE),
						column: Math.floor((this.position.x - 9) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y + 7) / TILE_SIZE),
						column: Math.floor((this.position.x - 9) / TILE_SIZE),
					},
				];
			case Direction.RIGHT:
				return [
					{
						row: Math.floor((this.position.y - 8) / TILE_SIZE),
						column: Math.floor((this.position.x + 8) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y + 7) / TILE_SIZE),
						column: Math.floor((this.position.x + 8) / TILE_SIZE),
					},
				];
			case Direction.DOWN:
				return [
					{
						row: Math.floor((this.position.y + 8) / TILE_SIZE),
						column: Math.floor((this.position.x - 8) / TILE_SIZE),
					},
					{
						row: Math.floor((this.position.y + 8) / TILE_SIZE),
						column: Math.floor((this.position.x + 7) / TILE_SIZE),
					},
				];
			// here we're returning 2 objects
			//          {bomberman}
			//          {ob1} {ob2}
			//          {  block  }
			// we're also offsetting x and y differently to make sure we're checking correctly for collision
			// we do this because bomberman will walk around a wall if he can, if no collision ahead and only colliding with the second part of the block, means you can go for example right+down (if you're in the right half of the block and theres nothing down after it)
		}
	}

	applyPowerup(type) {
		switch (type) {
			case CollisionTile.POWERUP_FLAME:
				this.bombStrength += 1;
				break;

			case CollisionTile.POWERUP_BOMB:
				this.bombAmount += 1;
				this.availableBombs += 1;
				break;
			case CollisionTile.POWERUP_SPEED:
				this.SpeedMultiplier += 0.4;
				break;
		}
	}

	shouldBlockMovement(tileCoords) {
		const tileCoordsMatch =
			tileCoords[0].column === tileCoords[1].column &&
			tileCoords[0].row === tileCoords[1].row;
		const tiles = [
			this.getCollisionTile(tileCoords[0]),
			this.getCollisionTile(tileCoords[1]),
		]; //getcolTile is a helper function for collisionmap which will return the value of the specified row and column collision

		if (
			(tileCoordsMatch && tiles[0] >= CollisionTile.WALL) ||
			(tiles[0] >= CollisionTile.WALL && tiles[1] >= CollisionTile.WALL)
		) {
			return true;
		}
		return false;
	}

	// HERE WE USE MOVEMENTLOOKUP WITH THE {...} BECAUSE WE WANT TO MAKE A COPY, NOT PASS REFERENCE
	performWallCheck(direction) {
		const collisionCoords = this.getCollisionCoords(direction);
		// console.log(this.shouldBlockMovement(collisionCoords));
		if (this.shouldBlockMovement(collisionCoords))
			return [this.direction, { x: 0, y: 0 }]; // this means movement is blocked since both coords (the one in front and the current one are block/wall)

		const counterDirections = CounterDirectionsLookup[direction];
		if (this.getCollisionTile(collisionCoords[0]) >= CollisionTile.WALL) {
			return [
				counterDirections[0],
				{ ...MovementLookup[counterDirections[0]] },
			];
		} // we know at least one of the coordinates is empty  IF nearest collisionTile = WALL, then reverse back for previous EMPTY tile
		if (this.getCollisionTile(collisionCoords[1]) >= CollisionTile.WALL) {
			return [
				counterDirections[1],
				{ ...MovementLookup[counterDirections[1]] },
			];
		} // if furthest collisionTile = WALL, then continue on for next EMPTY tile

		return [direction, { ...MovementLookup[direction] }]; // if neither is true, continue walking in requested direction
	}

	getMovement() {
		if (control.isLeft(this.id)) {
			return this.performWallCheck(Direction.LEFT);
		} else if (control.isRight(this.id)) {
			return this.performWallCheck(Direction.RIGHT);
		} else if (control.isDown(this.id)) {
			return this.performWallCheck(Direction.DOWN);
		} else if (control.isUp(this.id)) {
			return this.performWallCheck(Direction.UP);
		}

		return [this.direction, { x: 0, y: 0 }];
	}
	handleIdleInit = () => {
		this.resetVelocity();
	};

	handleMovingInit = () => {
		this.animationFrame = 1;
	};

	handleDeathInit = () => {
		this.resetVelocity();
		this.animation = animations.deathAnimation;
	};

	handleGeneralState = (time) => {
		const [direction, velocity] = this.getMovement();
		if (control.isControlPressed(this.id, Control.ACTION))
			this.handleBombPlacement(time);

		this.animation = animations.moveAnimations[direction];
		this.direction = direction;

		return velocity;
	};

	handleIdleState = (time) => {
		const velocity = this.handleGeneralState(time);
		if (isZero(velocity)) return;

		this.changeState(BombermanStateType.MOVING, time);
	};

	handleMovingState = (time) => {
		this.velocity = this.handleGeneralState(time);
		if (!isZero(this.velocity)) return;

		this.changeState(BombermanStateType.IDLE, time);
	};

	handleDeathState = (time) => {
		if (animations.deathAnimation[this.animationFrame][1] !== - 1) return;
		this.onEnd(this.id);
	};

	//function will be called when the bomb is removed from the game
	handleBombExploded = () => {
		if (this.availableBombs < this.bombAmount) this.availableBombs += 1;
	};

	handleBombPlacement(time) {
		if (this.availableBombs <= 0) return; //checking if the player have any bombs to drop
		//this function will get the players cell position to drop the bomb
		const playerCell = {
			row: Math.floor(this.position.y / TILE_SIZE),
			column: Math.floor(this.position.x / TILE_SIZE),
		};
		// console.log(playerCell);
		if (
			this.getStageCollisionTileAt(playerCell) !=
			CollisionTile.EMPTY
		)
			return;
		//this will make sure that the cell is not occupied
		this.availableBombs -= 1;
		this.lastBombCell = playerCell;
		// console.log("lastbombcell:", this.lastBombCell);
		this.onBombPlaced(
			playerCell,
			this.bombStrength,
			time,
			this.handleBombExploded
		);
		// console.log(this.collisionMap);
	}

	updatePosition(time) {
		this.position.x +=
			this.velocity.x *
			this.baseSpeedTime *
			this.SpeedMultiplier *
			time.secondsPassed;
		this.position.y +=
			this.velocity.y *
			this.baseSpeedTime *
			this.SpeedMultiplier *
			time.secondsPassed;
	}

	updateAnimation(time) {
		if (
			time.previous < this.animationTimer ||
			this.currentState.type === BombermanStateType.IDLE
		)
			return;
		// console.log(time.previous);
		this.animationFrame += 1;
		if (this.animationFrame >= this.animation.length) this.animationFrame = 0;

		this.animationTimer =
			time.previous + this.animation[this.animationFrame][1] * FRAME_TIME;
	}

	resetLastBombCell(playerCell) {
		// console.log("in reset:", this.lastBombCell);
		if (!this.lastBombCell) return;

		// console.log("in reset 2:", this.lastBombCell);

		if (
			playerCell.row == this.lastBombCell.row &&
			playerCell.column == this.lastBombCell.column &&
			this.getStageCollisionTileAt(this.lastBombCell) ==
			CollisionTile.BOMB
		) {
			return;
		}

		this.lastBombCell = undefined;
	}

	checkFlameTileCollision(playerCell, time) {
		if (
			this.getCollisionTile(playerCell) !== CollisionTile.FLAME ||
			this.currentState.type === BombermanStateType.DEATH
		)
			return;

		this.changeState(BombermanStateType.DEATH, time);
	}

	updateCellUnderneath(time) {
		const playerCell = {
			row: Math.floor(this.position.y / TILE_SIZE),
			column: Math.floor(this.position.x / TILE_SIZE),
		};

		this.resetLastBombCell(playerCell);
		this.checkFlameTileCollision(playerCell, time);
	}

	update(time) {
		this.updatePosition(time);
		this.currentState.update(time);
		this.updateAnimation(time);
		this.updateCellUnderneath(time);
	}
	//we get this data from the frameKey from bomberman.js constant
	draw(context, camera) {
		const [frameKey] = this.animation[this.animationFrame];
		const frame = this.frames.get(frameKey);

		drawFrameOrigin(
			context, this.image, frame,
			Math.floor(this.position.x - camera.position.x),
			Math.floor(this.position.y - camera.position.y),
			[this.direction === Direction.RIGHT ? -1 : 1, 1] // if bomberman faces right , drawFrameorigin allows you to flip the image (thats why there is only one side rather than 2). Direction is set to -1 or 1 (left or right)
		);

		if (!DEBUG) return;

		drawBox(context, camera,
			[this.position.x - HALF_TILE_SIZE, this.position.y - HALF_TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1,], "#FFFF00");
		drawCross(context, camera, { x: this.position.x, y: this.position.y }, "#FFF"
		);
	}
}
