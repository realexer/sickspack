import path from "path";
import fs from "fs";
import {readAllFilesInDir} from "../simpe-files";

import webp from 'webp-converter';

export const makeWebpInDirectory = async (dirPath) =>
{
	const imagesToConvert = readAllFilesInDir(dirPath);

	for(let imageFilePath of imagesToConvert)
	{
		try
		{
			console.log(`Checking webp for ${imageFilePath}`);

			const destinationFile = `${path.dirname(imageFilePath)}/${path.basename(imageFilePath, path.extname(imageFilePath))}.webp`;

			if(fs.existsSync(destinationFile)) {
				console.log(`Webp exists for ${imageFilePath}`);
				continue;
			}

			console.log(`Making webp from ${imageFilePath}`);

			const result = await webp.cwebp(imageFilePath, destinationFile, "-q 80","-v");

			console.log(`Webp created. `);
		}
		catch (e)
		{
			console.error(`Webp creation failed. Details: ${e}`);
		}
	}
}