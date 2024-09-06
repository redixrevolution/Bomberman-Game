import { BlockSystem } from "../src/game/systems/BlockSystem";
import { Block } from "../src/game/entities/Block";
import { MapTile, CollisionTile, playerStartCoords, stageData } from "../src/game/constants/levelData";
import { jest } from '@jest/globals';

// Assuming jest and other mocks are correctly set up as shown previously
describe("BlockSystem", () => {
    let blockSystem;
    let mockUpdateStageMapAt, mockGetCollisionTileAt, mockAddPowerup;

    beforeEach(() => {
        mockUpdateStageMapAt = jest.fn();
        mockGetCollisionTileAt = jest.fn(() => 0); // Default to returning EMPTY
        mockAddPowerup = jest.fn();
        blockSystem = new BlockSystem(mockUpdateStageMapAt, mockGetCollisionTileAt, mockAddPowerup);
    });

    it("initializes and adds blocks up to the defined limit", () => {
        expect(blockSystem.blocks.length).toBeLessThanOrEqual(stageData.maxBlocks);
    });

    it("does not place blocks in start zones or non-empty tiles", () => {
        expect(mockGetCollisionTileAt).toHaveBeenCalled();
        expect(blockSystem.blocks.every(block => {
            const coords = [block.cell.row, block.cell.column];
            return !playerStartCoords.some(startCoord =>
                startCoord[0] === coords[0] && startCoord[1] === coords[1]);
        })).toBeTruthy();
    });

    it("handles block removal correctly, including spawning powerups", () => {
        const block = blockSystem.blocks[0];
        block.powerup = 1; // Assume a powerup type is assigned

        blockSystem.remove(block);

        expect(mockUpdateStageMapAt).toHaveBeenCalledWith(block.cell, MapTile.FLOOR);
        expect(mockAddPowerup).toHaveBeenCalledWith(block.cell, block.powerup);
        expect(blockSystem.blocks.includes(block)).toBeFalsy();
    });

    it("updates all blocks during system update", () => {
        const mockTime = { previous: 100 };
        blockSystem.update(mockTime);

        blockSystem.blocks.forEach(block => {
            block.entity && expect(block.entity.update).toHaveBeenCalledWith(mockTime);
        });
    });

    it("draws all blocks during system draw", () => {
        const mockContext = {};
        const mockCamera = {};
        blockSystem.draw(mockContext, mockCamera);

        blockSystem.blocks.forEach(block => {
            block.entity && expect(block.entity.draw).toHaveBeenCalledWith(mockContext, mockCamera);
        });
    });
});
