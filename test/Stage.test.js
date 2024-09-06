import { Stage } from "../src/game/entities/Stage";
import * as LevelData from "../src/game/constants/levelData";
import { jest } from '@jest/globals';


function structuredCloneFallback(obj) {
    return JSON.parse(JSON.stringify(obj));
}

global.structuredClone = global.structuredClone || structuredCloneFallback;


jest.mock("../src/engine/context.js", () => ({
    drawTile: jest.fn(),
}));

global.OffscreenCanvas = class OffscreenCanvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.getContext = jest.fn(() => ({
            drawImage: jest.fn(),
            fillRect: jest.fn(), // Any other methods used by Stage
        }));
    }
};

document.querySelector = jest.fn().mockReturnValue({
    width: 64,  // Assume some dimensions for the stage image
    height: 64,
});

describe("Stage", () => {
    let stage;
    beforeEach(() => {
        stage = new Stage();
    });

    describe("constructor", () => {
        it("builds the stage map correctly", () => {
            expect(stage.tileMap).toEqual(LevelData.stageData.tiles);
            expect(stage.collisionMap).not.toBeNull();
            expect(stage.stageImageContext.drawImage).toHaveBeenCalledTimes(LevelData.stageData.tiles.length * LevelData.stageData.tiles[0].length);
        });
    });

    describe("getCollisionTileAt", () => {
        it("returns the correct collision tile", () => {
            const collisionTile = stage.getCollisionTileAt({ row: 0, column: 0 });
            const expectedTile = LevelData.MapToCollisionTileLookup[LevelData.stageData.tiles[0][0]];
            expect(collisionTile).toBe(expectedTile);
        });
    });


});
