export const Direction = {
	UP: "direction-up",
	DOWN: "direction-down",
	LEFT: "direction-left",
	RIGHT: "direction-right",
};

export const MovementLookup = {
	[Direction.LEFT]: { x: -1, y: 0 },
	[Direction.RIGHT]: { x: 1, y: 0 },
	[Direction.UP]: { x: 0, y: -1 },
	[Direction.DOWN]: { x: 0, y: 1 },
};
// when going left or right, you can go up and down aswell
// when going up or down, you can go left or right aswell
export const CounterDirectionsLookup = {
	[Direction.LEFT]: [Direction.DOWN, Direction.UP],
	[Direction.RIGHT]: [Direction.DOWN, Direction.UP],
	[Direction.UP]: [Direction.RIGHT, Direction.LEFT],
	[Direction.DOWN]: [Direction.RIGHT, Direction.LEFT],
};
