export const ChangeFreq =
{
	always: "always",
	hourly: "hourly",
	daily: "daily",
	weekly: "weekly",
	monthly: "monthly",
	yearly: "yearly",
	never: "never"
};

export class SitemapPageMetadata
{
	constructor(baseUrl, location, priority, changeFreq, lastMod)
	{
		this.baseUrl = baseUrl;
		this.location = location;
		this.priority = priority;
		this.changeFreq = changeFreq;
		this.lastMod = lastMod;
	}

	localizeLocation(lang) {
		return this.location.replace('_lang_', lang);
	}
}

export class SitemapPage
{
	constructor(metaData, alternatives)
	{
		this.metaData = metaData;
		this.alternatives = alternatives || [];
	}

	toXML()
	{
		const alternatives = this.alternatives.map(a => a.toXML()).join('\n');
		const priority = this.metaData.priority ? `<priority>${this.metaData.priority.toFixed(1)}</priority>` : '';
		const changeFreq = this.metaData.changeFreq ? `<changefreq>${this.metaData.changeFreq}</changefreq>` : '';
		const lastMod = this.metaData.lastMod ? `<lastmod>${this.metaData.lastMod}</lastmod>` : '';

		return `
						<url>
							<loc>${this.metaData.baseUrl}${this.metaData.location}</loc>
							${priority}
							${changeFreq}
							${alternatives}
							${lastMod}
						</url>`;
	}
}

export class SitemapPageAlternative
{
	constructor(baseUrl, location, lang)
	{
		this.baseUrl = baseUrl;
		this.location = location;
		this.lang = lang;
	}

	toXML()
	{
		return `
							<xhtml:link rel="alternate" hreflang="${this.lang}" href="${this.baseUrl}${this.location}"/>`;
	}
}

export const generateSitemap = (pagesList) =>
{
	const parts = [
		`<?xml version="1.0" encoding="UTF-8" ?>`
	];

	parts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`)

	pagesList.forEach(page => {
		parts.push(page.toXML());
	});

	parts.push(`</urlset>`);

	return parts.join('\n');
};