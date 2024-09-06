import { Bomberman } from "../src/game/entities/Bomberman";
import * as Context from "../src/engine/context";
import * as InputHandler from "../src/engine/inputHandler";
import { jest } from '@jest/globals';

jest.mock("../src/engine/context", () => ({
    drawFrameOrigin: jest.fn(),
    drawBox: jest.fn(),
    drawCross: jest.fn(),
}));

jest.mock("../src/engine/inputHandler", () => ({
    isLeft: jest.fn(),
    isRight: jest.fn(),
    isDown: jest.fn(),
    isUp: jest.fn(),
    isControlPressed: jest.fn(),
}));

// Mock document.querySelector for image loading
document.querySelector = jest.fn().mockReturnValue({
    width: 64, // Dummy width
    height: 64, // Dummy height
});

describe("Bomberman", () => {
    let bomberman;
    let mockGetStageCollisionTileAt;
    let mockOnBombPlaced;
    let mockOnEnd;

    beforeEach(() => {
        mockGetStageCollisionTileAt = jest.fn().mockReturnValue(0); // Assume no collision by default
        mockOnBombPlaced = jest.fn();
        mockOnEnd = jest.fn();
        bomberman = new Bomberman(0, { previous: 0 }, mockGetStageCollisionTileAt, mockOnBombPlaced, mockOnEnd);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("updatePosition", () => {
        it("should update position based on velocity and time", () => {
            bomberman.velocity = { x: 1, y: 0 };
            bomberman.baseSpeedTime = 1;
            bomberman.SpeedMultiplier = 1;
            bomberman.updatePosition({ secondsPassed: 1 });
            expect(bomberman.position.x).toBeGreaterThan(32); // Assuming starting x was 32
        });
    });

    describe("handleBombPlacement", () => {
        it("should place a bomb if a bomb is available and tile is empty", () => {
            mockGetStageCollisionTileAt.mockReturnValue(0); // Empty tile
            bomberman.availableBombs = 1;
            bomberman.handleBombPlacement({ previous: 1000 });
            expect(bomberman.availableBombs).toBe(0);
            expect(mockOnBombPlaced).toHaveBeenCalled();
        });

        it("should not place a bomb if the tile is not empty", () => {
            mockGetStageCollisionTileAt.mockReturnValue(1); // Non-empty tile
            bomberman.availableBombs = 1;
            bomberman.handleBombPlacement({ previous: 1000 });
            expect(bomberman.availableBombs).toBe(1);
            expect(mockOnBombPlaced).not.toHaveBeenCalled();
        });
    });

    // Additional tests can include drawing, handling death state, etc.
});
