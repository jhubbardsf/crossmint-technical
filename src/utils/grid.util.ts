import { Polyanet } from "@models/polyanet.model";

export class GridUtil {
	static generateCrossPositions(size: number): Polyanet[] {
		const positions: Polyanet[] = [];
		for (let i = 0; i < size; i++) {
			positions.push({ row: i, column: i });
			positions.push({ row: i, column: size - 1 - i });
		}
		return positions;
	}
}
