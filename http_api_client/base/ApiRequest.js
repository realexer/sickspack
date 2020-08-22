import {ApiResult, ApiResultCode} from "./ApiResult";


let _contentType = "application/json";
let _successCodes = [
	ApiResultCode.success
];
let _fetch = null;

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
	 * @returns {Promise<ApiResult>}
	 */
	static async get(url)
	{
		return await ApiRequest.perform(ApiRequestType.GET, url);
	};

	/**
	 *
	 * @param url
	 * @param data
	 * @returns {Promise<ApiResult>}
	 */
	static async post(url, data)
	{
		return await ApiRequest.perform(ApiRequestType.POST, url, await _formatter.request(data));
	}

	/**
	 *
	 * @param type
	 * @param url
	 * @param data
	 * @returns {Promise<ApiResult>}
	 */
	static async perform(type, url, data = null)
	{
		const result = new ApiResult();

		try
		{
			const response = await ApiRequest.timeoutFetch(`${url}`, {
				method: type,
				headers: {
					'Content-Type': _contentType,
				},
				body: data
			}, _timeout);

			const responseData = await _formatter.response(response);

			_responseProcessor(result, response, responseData);

		} catch (e) {
			console.error(e);
			result.setError(e.toString());
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
	static async timeoutFetch (url, options, timeout = 0)
	{
		if(timeout > 0)
		{
			let timer = null;

			return Promise.race([
				(async () => {
					const result = await _fetch(url, options);

					if(timer) {
						clearTimeout(timer);
					}

					return result;
				})(),
				new Promise((_, reject) => {
					timer = setTimeout(() =>
					{
						reject(new Error(`Soft timeout [${timeout}] seconds.`));
					},
					timeout * 1000);
				})
			]);
		} else {
			return _fetch(url, options)
		}
	}
}

export default ApiRequest;