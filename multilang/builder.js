import fs from 'fs';
import path from 'path';
import * as JsonTranslator from '../json-translator';
import {flattenObject, readByPath, writeByPath} from "../object-key-path";

export const buildLangs = async (fromObject, langCodes, savePath) =>
{
	for(let lang of langCodes)
	{
		try {
			console.debug(`Translating: [${lang}]`);

			const translation = await JsonTranslator.translateObject(JSON.parse(JSON.stringify(fromObject)), lang);
			await fs.promises.writeFile(path.resolve(__dirname, `${savePath}/${lang}.js`),
				`export default ${JSON.stringify(translation, null, '\t')}`);

		} catch (e) {
			console.error(e);
		}
	}
};

export const refreshLangs = async (fromObject, translations, savePath) =>
{
	const langKeys = flattenObject(fromObject);

	for(let lang in translations)
	{
		try {

			console.debug(`Translating: [${lang}]`);

			const langTranslation = translations[lang];

			for(let keyPath in langKeys)
			{
				const originalValue = readByPath(fromObject, keyPath);

				if(readByPath(langTranslation, keyPath) === undefined)
				{
					console.debug(`Translating: [${originalValue}]`);

					const translatedValue = await JsonTranslator.translateObject(JSON.parse(JSON.stringify(originalValue)), lang);

					writeByPath(langTranslation, keyPath, translatedValue);
				}
			}

			await fs.promises.writeFile(path.resolve(__dirname, `${savePath}/${lang}.js`),
				`export default ${JSON.stringify(langTranslation, null, '\t')}`);

		} catch (e) {
			console.error(e);
		}
	}
};

/**
 * Checks whether translations has all required keys and that all values includes all required data placeholders.
 * @param source
 * @param translations
 */
export const validateTranslations = (source, translations) =>
{
	const issues = {};

	const allKeys = flattenObject(source);
	const flattenTranslations = {};

	for(let lang in translations) {
		issues[lang] = [];
		flattenTranslations[lang] = flattenObject(translations[lang]);
	}

	const dataEntriesPattern = /_[^\W_]+_/gi;

	for(let keyPath in allKeys) {
		const value = allKeys[keyPath];

		const matches = value.match(dataEntriesPattern);

		if(matches)
		{
			for(let i in matches)
			{
				const dataPlaceholder = matches[i];

				for(let lang in flattenTranslations)
				{
					const translatedValue = flattenTranslations[lang][keyPath];
					if(!translatedValue) {
						issues[lang].push(`[${keyPath}]: not found.`);
						continue;
					}

					if(translatedValue.match(new RegExp(dataPlaceholder, 'i')) === null) {
						issues[lang].push(`[${keyPath}]: '${dataPlaceholder}' missing.`);
						continue;
					}

					flattenTranslations[lang][keyPath] = translatedValue.replace(dataPlaceholder, '');
				}
			}
		}
	}

	return issues;
};