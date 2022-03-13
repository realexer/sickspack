import {readByPath} from '../object-key-path';
import Multilang from "./index";

const defaultData = {};
const formats = [];

export const _lang = function(path, _default = "", data = {})
{
	return _langBy(Multilang.getLang(), path, _default, data);
};

export const _langBy = function(lang, path, _default = "", data = {})
{
	if(typeof _default === 'object') {
		data = _default;
		_default = "";
	}

	let value = readByPath(Multilang.getLangTranslation(lang), path) || _default;

	return _format(value, Object.assign({}, defaultData, data));
};

export const addDefaultData = (key, value) =>
{
	defaultData[key] = value;
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

		case 'number':
			value = value;
			break;

		default:
			value = _formatString(value, data);
	}

	return value;
};

const _formatString = (value, data) =>
{
	for(let key in data) {
		let replacement = data[key];
		if(typeof  replacement === 'function') {
			replacement = replacement();
		}
		value = value.replace(new RegExp(`_${key}_`, 'ig'), replacement);
	}

	for(let i in formats) {
		let [expression, replacement] = formats[i];
		value = value.replace(expression, replacement);
	}

	return value;
};