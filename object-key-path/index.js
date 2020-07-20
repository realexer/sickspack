// stolen from: https://stackoverflow.com/a/6491621/665902

export const getPathKeys = (path) =>
{
	path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	path = path.replace(/^\./, '');           // strip a leading dot
	return path.split('.');
};

export const readByPath = (object, path) =>
{
	const pathKeys = getPathKeys(path);

	for (let i = 0, n = pathKeys.length; i < n; ++i)
	{
		let key = pathKeys[i];
		if (key in object) {
			object = object[key];
		} else {
			return;
		}
	}
	return object;
};

export const writeByPath = (object, path, value) =>
{
	const pathKeys = getPathKeys(path);

	let key;
	for (let i = 0, n = pathKeys.length; i < n; ++i)
	{
		key = pathKeys[i];
		if ((key in object) === false) {

			object[key] = {};
		}

		if(i < pathKeys.length - 1) {
			object = object[key];
		} else {
			object[key] = value;
		}
	}
};

export const flattenObject = (object, keyPath = []) =>
{
	let keys = {};

	switch (typeof object)
	{
		case 'object':
			for(let key in object) {
				let path = [...keyPath, key];
				keys = Object.assign(keys, flattenObject(object[key], path));
			}
			break;

		case 'array':
			for(let i = 0; i < object.length; i++) {
				let path = [...keyPath, i];
				keys = Object.assign(keys, flattenObject(object[i], path));
			}
			break;

		default:
			keys[keyPath.join('.')] = object;
	}

	return keys;
};