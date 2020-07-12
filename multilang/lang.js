import {readByPath} from '../object-key-path';
import Multilang from "./index";

const formats = [];

export const _lang = function(path, _default = "", data = {})
{
	if(typeof _default === 'object') {
		data = _default;
		_default = "";
	}

	let value = readByPath(Multilang.getTranslation(), path) || _default;

	return _format(value, data);
};

export const addFormat = (regexp, replacement) =>
{
	formats.push([regexp, replacement]);
};

export const _format = (value, data) =>
{
	switch(typeof value) {
		case 'array':
			for(let i = 0; i < value.length; i++) {
				value[i] = _format(value[i]);
			}
			break;

		case 'object':
			for(let key in value) {
				value[key] = _format(value[key]);
			}
			break;

		default:
			value = _formatString(value, data);
	}

	return value;
};

const _formatString = (value, data) =>
{
	// TODO: keeping it in case if HtmlTagsMasker will not be enough to keep HTML tags in the original translation
	value = value.replace(/_open_(?<tag>[^_]+)_/gm, "<$1>");
	value = value.replace(/_close_(?<tag>[^_]+)_/gm, "</$1>");

	for(let key in data) {
		value = value.replace(`_${key}_`, data[key]);
	}

	for(let i in formats) {
		let [expression, replacement] = formats[i];
		value = value.replace(expression, replacement);
	}

	return value;
};