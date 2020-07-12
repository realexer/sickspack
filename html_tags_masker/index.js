export class HtmlTagsMask
{
	text = null;
	masks = {};

	constructor(maskedText, masks)
	{
		this.text = maskedText;
		this.masks = masks;
	}
}

export class HtmlTagsMasker
{
	static tagsPattern = /<[^>]+>|<\/[^>]+>/gm;

	static mask(text)
	{
		const masks = {};

		const matches = text.match(HtmlTagsMasker.tagsPattern);

		if(matches) {
			for(let i = 0; i < matches.length; i++)
			{
				const m = matches[i];
				const mask = ` _tag_${i}_ `;
				text = text.replace(m, mask);

				masks[mask] = m;
			}
		}

		return new HtmlTagsMask(text, masks);
	}

	/**
	 *
	 * @param {HtmlTagsMask} mask
	 */
	static unmask(mask)
	{
		let result = mask.text;

		for(let key in mask.masks) {
			result = result.replace(key.trim(), mask.masks[key]);
		}

		return result;
	}
}
