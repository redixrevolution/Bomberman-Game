import { TILE_SIZE } from "./game.js";

export const STAGE_MAP_MAX_SIZE = 64 * TILE_SIZE; // multiplying it so its 64 by 64 * tile size

export const playerStartCoords = [
	[1, 2], [2, 2], [1, 3],
	[1, 13], [1, 14], [2, 14],
	[10, 2], [11, 2], [11, 3],
	[10, 14], [11, 13], [11, 14],
	[5, 8], [6, 8], [7, 8], [5, 7], [5, 9], [7, 7], [7, 9],
]

export const MapTile = {
	OUTER_WALL: 29,
	FLOOR: 59,
	WALL: 30,
	BLOCK: 103,
};

export const CollisionTile = {
	EMPTY: 0, // WALKABLE
	POWERUP_FLAME: 1,
	POWERUP_BOMB: 2,
	POWERUP_SPEED: 3, // POWERUPS are lower value than wall so the player can walk through them
	FLAME: 10, //FLAME
	WALL: 20, // COLISION BUT NOT DESTRUCTABLE
	BOMB: 21, // BOMB, since it's higher than the wall, bomberman wont be able to pass through it (check shouldBlockMovement method)
	BLOCK: 30, // COLLISION BUT DESTRUCTABLE
};

export const MapToCollisionTileLookup = {
	[MapTile.FLOOR]: CollisionTile.EMPTY,
	[MapTile.WALL]: CollisionTile.WALL,
	[MapTile.OUTER_WALL]: CollisionTile.WALL,
	[MapTile.BLOCK]: CollisionTile.BLOCK,
};

export const stageData = {
	maxBlocks: 50,
	powerups: {
		[CollisionTile.POWERUP_FLAME]: 8,
		[CollisionTile.POWERUP_BOMB]: 8,
		[CollisionTile.POWERUP_SPEED]: 4,

	},
	tiles: [
		[29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 29],
		[29, 30, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 30, 29],
		[29, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 29],
		[29, 30, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 30, 29],
		[29, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 29],
		[29, 30, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 30, 29],
		[29, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 29],
		[29, 30, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 30, 29],
		[29, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 29],
		[29, 30, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 30, 29],
		[29, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 59, 30, 29],
		[29, 30, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 30, 29],
		[29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 29],
		[29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29],
	],
};
// These numbers are done according to the image stage where 1 row has 28 tiles. Tile number 29 is the first grey one (check image), tile 29 is the first wall, tile 59 is the first greass/green area

// here its the same as above but with collision logic implemented
// 29 and 30 will become WALL since we used those to make the outside of the map and the blocks that dont allow movement/destruction
// 59 becomes the empty value since it's designated for walking (no collision)
