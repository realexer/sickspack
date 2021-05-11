import path from "path";
import {readAllFilesInDir} from "../simpe-files";

import webp from 'webp-converter';

export const makeWebpInDirectory = async (dirPath) =>
{
	const imagesToConvert = readAllFilesInDir(dirPath);

	for(let imageFilePath of imagesToConvert)
	{
		console.log(`Making webp from ${imageFilePath}`);

		try
		{
			const destinationFile = `${path.dirname(imageFilePath)}/${path.basename(imageFilePath, path.extname(imageFilePath))}.webp`;
			const result = await webp.cwebp(imageFilePath, destinationFile, "-q 80","-v");

			console.log(`Webp created. `);
		}
		catch (e)
		{
			console.error(`Webp creation failed. Details: ${e}`);
		}
	}
}