import { Entity } from "engine/Entity.js";
import { drawTile } from "../../engine/context.js";
import {
	STAGE_MAP_MAX_SIZE,
	CollisionTile,
	MapToCollisionTileLookup,
	stageData,
} from "../constants/levelData.js";
import { TILE_SIZE } from "../constants/game.js";


export class Stage extends Entity {
	tileMap = structuredClone(stageData.tiles);
	collisionMap = stageData.tiles.map((row) => row.map((tile) => MapToCollisionTileLookup[tile]));


	image = document.querySelector('img#stage');
	stageImage = new OffscreenCanvas(STAGE_MAP_MAX_SIZE, STAGE_MAP_MAX_SIZE);

	constructor() {
		// We know the stage entity doesn't move so we make the position aspect of it static
		super({ x: 0, y: 0 });

		this.stageImageContext = this.stageImage.getContext('2d');

		// This is what the original game has and ofscreencanvas generates a canvas outside the DOM and can be used to be drawn beforehand and the result gets carried into the canvas
		this.buildStageMap();
	}

	getCollisionTileAt = (cell) => {
		return this.collisionMap[cell.row][cell.column] ?? CollisionTile.EMPTY;
	}

	updateMapAt = (cell, tile) => {
		this.tileMap[cell.row][cell.column] = tile;
		this.collisionMap[cell.row][cell.column] = MapToCollisionTileLookup[tile];

		drawTile(this.stageImageContext, this.image, tile, cell.column * TILE_SIZE, cell.row * TILE_SIZE, TILE_SIZE);
	}

	buildStageMap() {
		for (let rowIndex = 0; rowIndex < this.tileMap.length; rowIndex++) {
			for (let columnIndex = 0; columnIndex < this.tileMap[rowIndex].length; columnIndex++) {
				const tile = this.tileMap[rowIndex][columnIndex];
				this.updateMapAt({ row: rowIndex, column: columnIndex }, tile)
			}

		}
	}

	update = () => undefined;

	draw(context, camera) {
		//This is where we see the benefit of offscreen canvas, it is drawn once here and then carried to main canvas instead of being drawn 28(tiles per row) * 13 (rows) = 364 drawImage calls -> way more efficient
		context.drawImage(this.stageImage, -camera.position.x, -camera.position.y); // Using these as negative values so they're subtracted from the top left (where the canvas starts) 
	}
}
