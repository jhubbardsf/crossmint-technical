export type Colors = "blue" | "red" | "purple" | "white";
export type Directions = "up" | "down" | "left" | "right";
type MapOptions = "SPACE" | "POLYANET" | "SOLOONS" | "COMETHS";
export type GoalMap = MapOptions[][];
export type TRoute = "polyanets" | "soloons" | "comeths";

interface Shape {
	row: number;
	column: number;
}

export interface Polyanet extends Shape {}

export interface Soloon extends Shape {
	color: Colors;
}
export interface Cometh extends Shape {
	direction: Directions;
}
