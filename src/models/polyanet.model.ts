type Colors = "blue" | "red" | "purple" | "white";
type Directions = "up" | "down" | "left" | "right";

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
