import fs from 'fs';
import path from 'path';

export const readAllFilesInDir = (dirPath) =>
{
	let files = [];

	fs.readdirSync(dirPath).forEach(item =>
	{
		const filePath = path.join(dirPath, item);

		if (fs.statSync(filePath).isDirectory()) {
			files = files.concat(readAllFilesInDir(filePath));
		}
		else {
			files.push(filePath);
		}
	});

	return files;
}