import { drawTile } from "../src/engine/context.js";
import {
    BASE_BOTTOM_LAST_FRAME,
    BASE_FRAME,
    BASE_HORIZONTAL_FRAME,
    BASE_LEFT_LAST_FRAME,
    BASE_RIGHT_LAST_FRAME,
    BASE_TOP_LAST_FRAME,
    BASE_VERTICAL_FRAME,
    EXPLOSION_ANIMATION,
    EXPLOSION_FRAME_DELAY,
    FLAME_ANIMATION,
} from "../src/game/constants/bombs.js";
import { TILE_SIZE } from "../src/game/constants/game.js";

import { BombExplosion } from "../src/game/entities/BombExplosion";
import { jest } from '@jest/globals';
import * as Context from "../src/engine/context";

jest.mock("../src/engine/context", () => ({
    drawTile: jest.fn(),
}));

document.querySelector = jest.fn().mockReturnValue({
    width: 64, // Assume width and height for simplicity
    height: 64,
});

describe("BombExplosion", () => {
    let bombExplosion;
    let mockOnEnd;
    let time;
    let flameCells;

    beforeEach(() => {
        mockOnEnd = jest.fn();
        time = { previous: 0 };
        flameCells = [
            { cell: { column: 5, row: 5 }, isVertical: false, isLast: false },
            { cell: { column: 5, row: 6 }, isVertical: true, isLast: true }
        ];
        bombExplosion = new BombExplosion({ column: 5, row: 5 }, flameCells, time, mockOnEnd);
    });

    describe("getBaseFrame", () => {
        it("returns horizontal frame for non-vertical, non-last cells", () => {
            const frame = bombExplosion.getBaseFrame(flameCells[0]);
            expect(frame).toBe(BASE_HORIZONTAL_FRAME);
        });

        it("returns vertical last frame for vertical last cells", () => {
            const frame = bombExplosion.getBaseFrame(flameCells[1]);
            expect(frame).toBe(BASE_BOTTOM_LAST_FRAME);
        });
    });

    describe("updateAnimation", () => {
        it("advances the animation frame and resets on cycle completion", () => {
            bombExplosion.updateAnimation({ previous: EXPLOSION_FRAME_DELAY });
            expect(bombExplosion.animationFrame).toBe(1);

            // Simulate enough updates to complete the cycle
            for (let i = 0; i < EXPLOSION_ANIMATION.length; i++) {
                bombExplosion.updateAnimation({ previous: EXPLOSION_FRAME_DELAY * (i + 2) });
            }

            expect(bombExplosion.animationFrame).toBe(0);
            expect(mockOnEnd).toHaveBeenCalled();
        });
    });

});
