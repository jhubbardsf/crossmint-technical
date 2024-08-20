import api from "./services/api";

for (let i = 0; i < 10; i++) {
	for (let j = 0; j < 10; j++) {
		try {
			console.log(`Deleting R${i}C${j}`);
			await api.delete("https://challenge.crossmint.io/api/polyanets", {
				json: {
					row: i,
					column: j,
					candidateId: process.env.CANDIDATE_ID,
				},
			});
			console.log(`Successfully deleted R${i}C${j}`);
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error deleting R${i}C${j}:`, error.message);
			} else {
				console.error(`Unknown error deleting R${i}C${j}`);
			}
		}
	}
}
