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
			const response = await _fetch(`${url}`, {
				method: type,
				headers: {
					'Content-Type': _contentType,
				},
				body: data
			});

			const responseData = await _formatter.response(response);

			_responseProcessor(result, response, responseData);

		} catch (e) {
			console.error(e);
			result.setError(e.toString());
		}

		return result;
	}
}

export default ApiRequest;