import {readByPath} from '../object-key-path';
import Multilang from "./index";

const formats = [];

export const _lang = function(path, _default = "", data = {})
{
	if(typeof _default === 'object') {
		data = _default;
		_default = "";
	}

	let value = readByPath(Multilang.getLang(), path) || _default;

	for(let key in data) {
		value = value.replace(`_${key}_`, data[key]);
	}

	return _format(value);
};

export const addFormat = (regexp, replacement) =>
{
	formats.push([regexp, replacement]);
};

export const _format = (text) =>
{

	for(let i in formats) {
		let [expression, replacement] = formats[i];
		text = text.replace(expression, replacement);
	}

	return text;
};