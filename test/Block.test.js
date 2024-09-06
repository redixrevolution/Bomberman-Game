import { Block } from "../src/game/entities/Block.js";  // Adjusted to access Block.js correctly
import { FRAME_TIME, TILE_SIZE } from "../src/game/constants/game.js";  // Correct path to the constants
import { MapTile } from "../src/game/constants/levelData.js";  // Correct path to the constants
// Assuming you are using Jest and have the necessary setup
import { jest } from '@jest/globals';
const BLOCK_FRAME_DELAY = 4 * FRAME_TIME;
const NO_FRAMES = 8;
// Mock drawTile function from context.js
jest.mock("../src/engine/context.js", () => ({
    drawTile: jest.fn(),
}));

// Mock document.querySelector if it's used within Block.js for setting up the image
document.querySelector = jest.fn(() => ({
    width: 0, // Dummy width, adjust as necessary
    height: 0, // Dummy height, adjust as necessary
}));

describe("Block", () => {
    let block;
    let mockOnEnd;

    beforeEach(() => {
        mockOnEnd = jest.fn();
        block = new Block({ column: 0, row: 0 }, { previous: 0 }, mockOnEnd);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("updateAnimation", () => {
        it("should increment the animation frame", () => {
            const time = { previous: BLOCK_FRAME_DELAY };
            block.animationFrame = MapTile.BLOCK;
            block.updateAnimation({ previous: time.previous + BLOCK_FRAME_DELAY });
            expect(block.animationFrame).toBe(MapTile.BLOCK + 1);
        });

        it("should reset animation frame if exceeds number of frames", () => {
            const time = { previous: BLOCK_FRAME_DELAY };
            block.animationFrame = MapTile.BLOCK + NO_FRAMES - 1;
            block.updateAnimation({ previous: time.previous + BLOCK_FRAME_DELAY });
            expect(block.animationFrame).toBe(0);
            expect(mockOnEnd).toHaveBeenCalledWith(block);
        });

        it("should not update animation frame if time is not reached", () => {
            const time = { previous: BLOCK_FRAME_DELAY - 1 };
            block.updateAnimation(time);
            expect(block.animationFrame).toBe(MapTile.BLOCK);
        });
    });
});
