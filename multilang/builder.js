import fs from 'fs';
import path from 'path';
import * as JsonTranslator from '../json-translator';

export const buildLangs = async (fromObject, langCodes, savePath) =>
{
	for(let lang of langCodes)
	{
		try {
			console.debug(`Translating: [${lang}]`);

			const translation = await JsonTranslator.translateObject(fromObject, lang);
			await fs.promises.writeFile(path.resolve(__dirname, `${savePath}/${lang}.js`), `export default ${JSON.stringify(translation, null, '\t')}`);

		} catch (e) {
			console.error(e);
		}
	}
};