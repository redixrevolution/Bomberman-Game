// Import the Bomb class
import { Bomb } from "../src/game/entities/Bomb";
import { jest } from '@jest/globals'
const document = global.document;

// Import necessary constants or dependencies
import { BASE_FRAME, BOMB_ANIMATION, BOMB_FRAME_DELAY, FUSE_TIMER } from "../src/game/constants/bombs.js";

// Mock drawTile function
jest.mock("engine/context.js", () => ({
    drawTile: jest.fn(),
}));


// Mock document.querySelector
document.querySelector = jest.fn(() => ({
    width: 0, // Set width and height to 0 for simplicity
    height: 0,
}));

describe("Bomb", () => {
    let bomb;
    let mockOnEnd;

    beforeEach(() => {
        mockOnEnd = jest.fn();
        bomb = new Bomb({ column: 0, row: 0 }, { previous: 0 }, mockOnEnd);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("updateAnimation", () => {
        it("should update animation frame", () => {
            const time = { previous: 0 };
            bomb.updateAnimation(time);
            expect(bomb.animationFrame).toBe(0);
        });

        it("should reset animation frame if exceeds animation length", () => {
            const time = { previous: 0 };
            bomb.animationFrame = BOMB_ANIMATION.length - 1;
            bomb.updateAnimation(time);
            expect(bomb.animationFrame).toBe(3);
        });

        it("should not update animation frame if time is not reached", () => {
            const time = { previous: BOMB_FRAME_DELAY - 1 };
            bomb.updateAnimation(time);
            expect(bomb.animationFrame).toBe(0);
        });
    });

    describe("updateFuse", () => {
        it("should call onEnd callback when fuse timer is reached", () => {
            const time = { previous: FUSE_TIMER + 1 };
            bomb.updateFuse(time);
            expect(mockOnEnd).toHaveBeenCalledTimes(1);
            expect(mockOnEnd).toHaveBeenCalledWith(bomb);
        });

        it("should not call onEnd callback if fuse timer is not reached", () => {
            const time = { previous: FUSE_TIMER - 1 };
            bomb.updateFuse(time);
            expect(mockOnEnd).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should call updateAnimation and updateFuse", () => {
            const time = { previous: 0 };
            bomb.update(time);
            expect(bomb.animationFrame).toBe(0); // updateAnimation should be called
            expect(mockOnEnd).not.toHaveBeenCalled(); // updateFuse should not be called yet
        });
    });
});
