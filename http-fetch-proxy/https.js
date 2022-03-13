import https from 'https';
import requestPromise from "request-promise";

/**
 *
 * @param url
 * @param options {agent: can from socks-proxy-agent}
 * @returns {Promise<any>}
 */
const fetch = async (url, options) =>
{
	const fullOptions = Object.assign({

	}, options);

	return new Promise((resolve, reject) =>
	{
		let data = '';

		const responseInterface = {
			status: null,
			statusText: null,
			text: async () => {
				return data;
			},
			json: async () => {
				return JSON.parse(data);
			},
			_source: null
		};

		https.request(url, fullOptions, (res) =>
		{
			console.log(res.headers);

			resp.on('response', (chunk) => {

			});

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () =>
			{
				resolve(responseInterface);
			});
		})
		.on("error", (err) =>
		{
			reject(err);
		});
	});
};

export default fetch;