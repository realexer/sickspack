const {Translate} = require('@google-cloud/translate').v2;

let gTranslator = null;

export const setup = (apiKey) =>
{
	gTranslator = new Translate({key: apiKey});
};

export const translateText = async(text, to) =>
{
	const [translation] = await gTranslator.translate(text, to);

	return translation;
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