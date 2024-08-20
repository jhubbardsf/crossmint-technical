import ky, { HTTPError, Options as KyOptions } from "ky";

interface StrictRetryOptions extends KyOptions {
	retry: {
		limit: number;
		methods: string[];
		statusCodes: number[];
		backoffLimit: number;
		maxRetryAfter: number;
	};
}

const defaultOptions: StrictRetryOptions = {
	retry: {
		limit: 5,
		methods: ["get", "post", "put", "delete", "patch"],
		statusCodes: [408, 413, 429, 500, 502, 503, 504],
		backoffLimit: 3000,
		maxRetryAfter: 600000, // 10 minutes
	},
	hooks: {
		beforeRequest: [
			// options
			(request, options) => {
				console.log(`Sending ${request.method} request to ${request.url}`);
				console.log(`Body: `, options.body);
				console.log({ options });
				return request;
			},
		],
		afterResponse: [
			(_request, _options, response) => {
				console.log(`Received ${response.status} response`);
				return response;
			},
		],
		beforeRetry: [
			async ({ request, options, error, retryCount }) => {
				const strictOptions = options as StrictRetryOptions;
				let delay = Math.min(
					2 ** retryCount * 1000,
					strictOptions.retry.backoffLimit
				);

				if (error instanceof HTTPError) {
					console.error(
						`HTTP Error ${
							error.response.status
						}: ${await error.response.text()}`
					);
					const retryAfter = error.response.headers.get("Retry-After");
					if (retryAfter) {
						const retryAfterMs = Number(retryAfter) * 1000;
						if (!isNaN(retryAfterMs)) {
							delay = Math.min(retryAfterMs, strictOptions.retry.maxRetryAfter);
						}
					}
				} else if (error instanceof Error) {
					console.error(`Network error: ${error.message}`);
				}

				console.log(
					`Retrying request (attempt ${retryCount + 1}) after ${delay}ms`
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
			},
		],
	},
};

const api = ky.extend(defaultOptions);

export default api;
