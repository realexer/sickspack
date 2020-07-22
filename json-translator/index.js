import {HtmlTagsMasker} from "../html_tags_masker";

const {Translate} = require('@google-cloud/translate').v2;

let _maskTags = false;

let gTranslator = null;

class DataPlaceholderMasker
{
	static mask(input)
	{
		const pattern = /_(x[^\W]+)_/gi;
		return input.replace(pattern, `<$1>`)
	}

	static unmask(input)
	{
		const pattern = /\<(x[^\W]+)\>/gi;
		return input.replace(pattern, `_$1_`)
	}
}

export const setup = (apiKey, maskTags = false) =>
{
	gTranslator = new Translate({key: apiKey});
	_maskTags = maskTags;
};

export const translateText = async(text, to) =>
{
	if(_maskTags) {
		return await translateMaskedText(text, to);
	}

	return await translatePlainText(text, to);
};

/**
 *
 * @param text
 * @param to
 * @param model base|nmt
 * @returns {Promise<string | string[]>}
 */
export const translatePlainText = async(text, to, model='base') =>
{
	const request = {
		to: to,
		model: model
	};
	const maskedInput = DataPlaceholderMasker.mask(text);
	const [translation] = await gTranslator.translate(maskedInput, request);
	return DataPlaceholderMasker.unmask(translation);
};

export const translateMaskedText = async(text, to) =>
{
	const htmlTagsMask = HtmlTagsMasker.mask(text);

	htmlTagsMask.text = await translateText(htmlTagsMask.text, to);

	const result = HtmlTagsMasker.unmask(htmlTagsMask);

	return result;
};

export const translateJson = async (json, to) =>
{
	return JSON.stringify(await translateObject(JSON.parse(json), to));
};

export const translateObject = async (object, to) =>
{
	switch(typeof object)
	{
		case "object":
			for(let key in object)
			{
				object[key] = await translateObject(object[key], to);
			}
			break;

		case "array":
			for(let i = 0; i < object.length; i++) {
				object[i] = await translateText(object[i], to);
			}
			break;

		default:
			object = await translateText(object, to);
	}

	return object;
};