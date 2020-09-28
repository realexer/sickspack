import request from 'request';
import requestPromise from 'request-promise';

/**
 *
 * @param url
 * @param options {agent: can from socks-proxy-agent}
 * @returns {Promise<any>}
 */
const fetch = async (url, options) =>
{
	const fullOptions = Object.assign({
		url: url,
		resolveWithFullResponse: true,
		simple: false
	}, options);

	const response = await requestPromise(fullOptions);

	const responseInterface = {
		status: response.statusCode,
		statusText: response.statusMessage,
		text: async () => {
			return response.body;
		},
		json: async () => {
			return JSON.parse(response.body);
		},
		_source: response
	};

	return responseInterface;
};

export default fetch;