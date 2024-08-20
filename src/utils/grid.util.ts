import { Polyanet } from "@models/polyanet.model";

export class GridUtil {
	/**
	 * Generates positions for a cross shape in a grid of a given size.
	 *
	 * @param {number} size - The size of the grid.
	 * @return {Polyanet[]} An array of positions representing the cross shape.
	 */
	static generateCrossPositions(size: number): Polyanet[] {
		const positions: Polyanet[] = [];
		for (let i = 0; i < size; i++) {
			positions.push({ row: i, column: i });
			positions.push({ row: i, column: size - 1 - i });
		}
		return positions;
	}
}
