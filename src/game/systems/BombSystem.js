import { CollisionTile } from "game/constants/levelData.js";
import {
	FlameDirectionLookup,
	BOMB_EXPLODE_DELAY,
} from "game/constants/bombs.js";
import { Bomb } from "game/entities/Bomb.js";
import { BombExplosion } from "game/entities/BombExplosion.js";

export class BombSystem {
	bombs = [];

	constructor(stageCollisionMap, onBlockDestroyed) {
		this.collisionMap = stageCollisionMap;
		this.onBlockDestroyed = onBlockDestroyed;
	}

	getFlameCellsFor(rowOffset, columnOffset, startCell, length) {
		const flameCells = [];
		let cell = { ...startCell };

		for (let position = 1; position <= length; position++) {
			cell.row += rowOffset;
			cell.column += columnOffset;

			if (this.collisionMap[cell.row][cell.column] !== CollisionTile.EMPTY)
				break;

			flameCells.push({
				cell: { ...cell },
				isVertical: rowOffset !== 0,
				isLast: position === length,
			});
		}

		return { cells: flameCells, endCell: cell };
	}

	handleEndResult(endCell, time) {
		const endResult = this.collisionMap[endCell.row][endCell.column];

		switch (endResult) {
			case CollisionTile.BLOCK:
				this.onBlockDestroyed(endCell, time);
				break;
			case CollisionTile.BOMB: {
				const bombToExplode = this.bombs.find(
					(bomb) =>
						endCell.row == bomb.cell.row && endCell.column == bomb.cell.column
				);
				if (!bombToExplode) return;

				bombToExplode.fuseTimer = time.previous + BOMB_EXPLODE_DELAY;
				break;
			}
		}
	}

	getFlameCells(startCell, length, time) {
		const flameCells = [];

		for (const [rowOffset, columnOffset] of FlameDirectionLookup) {
			const { cells, endCell } = this.getFlameCellsFor(
				rowOffset,
				columnOffset,
				startCell,
				length
			);
			this.handleEndResult(endCell, time);

			if (cells.length > 0) flameCells.push(...cells);
		}
		return flameCells;
	}

	handleBombExploded(bomb, strength, time) {
		const index = this.bombs.indexOf(bomb);
		if (index < 0) return;

		const flameCells = this.getFlameCells(bomb.cell, strength, time);
		this.bombs[index] = new BombExplosion(
			bomb.cell,
			flameCells,
			time,
			this.remove
		);

		this.collisionMap[bomb.cell.row][bomb.cell.column] = CollisionTile.FLAME;
		for (const flameCell of flameCells) {
			this.collisionMap[flameCell.cell.row][flameCell.cell.column] =
				CollisionTile.FLAME;
		}
	}

	//removing a bomb from bomb array
	remove = (BombExplosion) => {
		const index = this.bombs.indexOf(BombExplosion);
		if (index < 0) return;
		// console.log(
		// 	"before removed",
		// 	this.collisionMap[BombExplosion.cell.row][BombExplosion.cell.column]
		// );
		// console.log("bomb is being removed");
		this.collisionMap[BombExplosion.cell.row][BombExplosion.cell.column] =
			CollisionTile.EMPTY;
		for (const flameCell of BombExplosion.flameCells) {
			this.collisionMap[flameCell.cell.row][flameCell.cell.column] =
				CollisionTile.EMPTY;
		}

		this.bombs.splice(index, 1);
		// console.log(
		// 	"after removed",
		// 	this.collisionMap[BombExplosion.cell.row][BombExplosion.cell.column]
		// );
	};

	//adding a bomb to the bomb array
	add = (cell, strength, time, onBombExploded) => {
		this.bombs.push(
			new Bomb(cell, time, (bomb) => {
				onBombExploded(bomb);
				this.handleBombExploded(bomb, strength, time);
			})
		);
		// console.log(this.collisionMap);
		// console.log(cell.row, cell.column);
		// this.collisionMap[cell.row][cell.column] = CollisionTile.BOMB;
		// console.log(CollisionTile.BOMB);
		// console.log(this.collisionMap[cell.row][cell.column]);
		// console.log(this.collisionMap);
	};

	update(time) {
		for (const bomb of this.bombs) {
			bomb.update(time);
		}
	}

	draw(context, camera) {
		for (const bomb of this.bombs) {
			bomb.draw(context, camera);
		}
	}
}
