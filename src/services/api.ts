import ky, { HTTPError, Options as KyOptions } from "ky";

const startTime = Bun.nanoseconds();
const getUptime = () => (Bun.nanoseconds() - startTime) / 1e9;
const MAX_BACKOFF = 3000; // 3 seconds

const defaultOptions: KyOptions = {
	retry: {
		limit: 50, // 50 retry limit
		methods: ["get", "post", "put", "delete", "patch"],
		statusCodes: [408, 413, 429, 500, 502, 503, 504],
		backoffLimit: MAX_BACKOFF,
		maxRetryAfter: 600000, // 10 minutes
	},
	hooks: {
		beforeRequest: [
			(request, options) => {
				const uptime = getUptime().toFixed(3);
				console.log(
					`[${uptime}s] Sending ${request.method} request to ${request.url}`
				);
				console.log(`[${uptime}s] Body: `, options.body);
				return request;
			},
		],
		afterResponse: [
			(_request, _options, response) => {
				const uptime = getUptime().toFixed(3);
				console.log(`[${uptime}s] Received ${response.status} response`);
				return response;
			},
		],
		beforeRetry: [
			async ({ error, retryCount }) => {
				const uptime = getUptime().toFixed(3);
				const estimatedDelay = Math.min(
					MAX_BACKOFF,
					0.3 * 2 ** (retryCount - 1) * 1000
				);
				console.log(
					`[${uptime}s] retryCount: ${retryCount}, estimatedDelay: ${estimatedDelay}`
				);

				if (error instanceof HTTPError) {
					console.error(
						`[${uptime}s] HTTP Error ${
							error.response.status
						}: ${await error.response.text()}`
					);
				} else if (error instanceof Error) {
					console.error(`[${uptime}s] Network error: ${error.message}`);
				}
			},
		],
	},
};

const api = ky.extend(defaultOptions);

export default api;
