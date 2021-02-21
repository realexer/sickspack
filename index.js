import {HtmlTagsMasker} from "./html_tags_masker";
import * as translator from "./json-translator";
import {flattenObject} from "./object-key-path";
import {validateTranslations} from "./multilang/builder";

const input = `Some _xdata_ text <p class="something"> more _XTOTAL_ text <strong>even more</strong></p>`;

const mask = HtmlTagsMasker.mask(input);

console.log(mask);

const result = HtmlTagsMasker.unmask(mask);

console.log(result);
console.log(input);

(async () => {
	translator.setup('AIzaSyCrpD6opErDmxeGoliE8w1k5lQTfVyvUUg');
	const translation = await translator.translateText(input, "ru");

	console.log(translation);

	const testObj = {
		a: 'value a',
		b: {
			c: [
				'value c0',
				'value c1'
			]
		},
		d: {
			e: 'value f'
		}
	};

	// const result = flattenObject(testObj);
	//
	// console.debug(result);
	//
	// const source = {
	// 	'a': 'something _b_',
	// 	'b': 'something _c_ and then something _d_ another _d_',
	// };
	//
	// const translations = {
	// 	'de': {
	// 		'b': 'something mistyped _c _ and then something _d_ and another _d_',
	// 	},
	// 	'sp': {
	// 		'a': 'something capitalized _B_',
	// 		'b': 'something and then something _d_ and another mistyped _d _',
	// 	},
	// 	'ch': {
	// 		'a': 'something capitalized _b_',
	// 		'b': 'something and then something _d_ and missing d',
	// 	},
	// 	'fine': source
	// };
	//
	// const validation = validateTranslations(source, translations);
	//
	// console.debug(validation);

})();