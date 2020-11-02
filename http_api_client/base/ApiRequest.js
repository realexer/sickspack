import {ApiResult, ApiResultCode} from "./ApiResult";


let _contentType = "application/json";
let _successCodes = [
	ApiResultCode.success
];
let _fetch = null;
let _fetchOptions = {};

let _formatter =
{
	request: async () => {
		return JSON.stringify(data);
	},
	response: async () =>
	{
		return await response.json();
	}
};

let _timeout = 0;

let _responseProcessor = (result, response, responseData) =>
{
	if(_successCodes.includes(response.status)) {
		result.setSuccess(responseData);
	} else {
		result.setError(responseData, response.status)
	}

	return result;
};

const ApiRequestType =
{
	GET: 'GET',
	POST: 'POST'
};

class ApiRequest
{
	static setFetch(fetch)
	{
		_fetch = fetch;
	}

	static setFetchOption(key, value) {
		_fetchOptions[key] = value;
	}

	static setFormatter(formatter)
	{
		_formatter = formatter;
	}

	static setContentType(contentType)
	{
		_contentType = contentType;
	}

	static setTimeout(seconds)
	{
		_timeout = seconds;
	}

	/**
	 *
	 * @param url
	 * @param options
	 * @returns {Promise<ApiResult>}
	 */
	static async get(url, options = {})
	{
		options.method = ApiRequestType.GET;

		return await ApiRequest.perform(url, options);
	};

	/**
	 *
	 * @param url
	 * @param data
	 * @param options
	 * @returns {Promise<ApiResult>}
	 */
	static async post(url, data, options = {})
	{
		options.method = ApiRequestType.POST;

		return await ApiRequest.perform(url, options, await _formatter.request(data));
	}

	/**
	 *
	 * @param url
	 * @param options
	 * @param data
	 * @returns {Promise<ApiResult>}
	 */
	static async perform(url, options = {}, data = null)
	{
		const result = new ApiResult();

		try
		{
			options = Object.assign({
				headers: {},
				body: data,
				timeout: _timeout * 1000
			}, options);

			if(_contentType) {
				options.headers['Content-Type'] = _contentType;
			}

			const response = await ApiRequest.timeoutFetch(`${url}`, options, _timeout);

			const responseData = await _formatter.response(response);

			_responseProcessor(result, response, responseData);

		}
		catch (e)
		{
			if(e.constructor === ApiRequestTimeoutError) {
				result.setError(e.toString(), ApiResultCode.timeout);
			}
			else if(e.constructor.name === "RequestError")
			{
				result.setError(e.toString(), ApiResultCode.timeout);
			}
			else
			{
				console.error(e);
				result.setError(e.toString());
			}
		}

		return result;
	}

	/**
	 *
	 * @param url
	 * @param options
	 * @param timeout in seconds
	 * @returns {Promise<any>}
	 */
	static async timeoutFetch (url, options, timeout)
	{
		return Promise.race([
			new Promise((_, reject) =>
			{
				if(timeout) {
					setTimeout(() =>
					{
						reject(new ApiRequestTimeoutError(`Soft timeout [${timeout}] seconds.`));
					},
						timeout * 1000);
				}
			}),
			_fetch(url, options)
		]);
	}
}

export class ApiRequestTimeoutError extends Error
{
	constructor(message)
	{
		super(message);
	}
}

export default ApiRequest;