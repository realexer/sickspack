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

	// for testing

})();
