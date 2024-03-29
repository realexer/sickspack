import languages from './langs/languages'

let current_lang = null;
let current_translation = null;

let translations = null;

class Multilang
{
	static setup(_translations)
	{
		translations = _translations;
	}

	static init(lang)
	{
		Multilang.switchLang(lang);
	}

	static getLang()
	{
		return current_lang;
	}

	static getTranslation()
	{
		return current_translation;
	}

	static getLangTranslation(lang)
	{
		return translations[lang];
	}

	static isTranslationAvailable(lang)
	{
		return translations[lang] !== undefined;
	}

	static getSupportedLanguages()
	{
		return Object.keys(languages)
			.filter(lang => Object.keys(translations || {}).includes(lang))
			.reduce((obj, key) => {
				obj[key] = languages[key];
				return obj;
			}, {});
	}

	static switchLang(lang)
	{
		if(Multilang.isTranslationAvailable(lang) === false) {
			throw `Unknown language [${lang}]`;
		}

		current_lang = lang;
		current_translation = translations[lang];
	}

	static getAvailableTranslations()
	{
		return translations;
	}
}

export default Multilang;