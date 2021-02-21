// stolen from: https://stackoverflow.com/a/6491621/665902

export const getPathKeys = (path) =>
{
	path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	path = path.replace(/^\./, '');           // strip a leading dot
	return path.split('.');
};

export const readByPath = (object, path, detailed = false) =>
{
	let type = {};
	const pathKeys = getPathKeys(path);

	for (let i = 0, n = pathKeys.length; i < n; ++i)
	{
		let key = pathKeys[i];
		if (key in object) {
			if(object.constructor.name === "Array") {
				type = [];
			} else {
				type = {};
			}

			object = object[key];
		} else {
			return;
		}
	}

	if(detailed === true) {
		return {
			type: type,
			value: object
		}
	}

	return object;
};

export const writeByPath = (object, path, value, type = {}) =>
{
	const pathKeys = getPathKeys(path);

	let key;
	for (let i = 0, n = pathKeys.length; i < n; ++i)
	{
		key = pathKeys[i];
		if ((key in object) === false) {

			object[key] = type;
		}

		if(i < pathKeys.length - 1) {
			object = object[key];
		} else {
			object[key] = value;
		}
	}
};

export const flattenObject = (object, keyPath = [], includeStrucutre = false) =>
{
	let keys = {};

	const addKey = (value) => {
		if(keyPath.length > 0) {
			keys[keyPath.join(".")] = value;
		}
	}

	switch (object.constructor.name)
	{
		case 'Object':
			if(includeStrucutre) {
				addKey({});
			}
			for(let key in object) {
				let path = [...keyPath, key];
				keys = Object.assign(keys, flattenObject(object[key], path, includeStrucutre));
			}
			break;

		case 'Array':
			if(includeStrucutre) {
				addKey([]);
			}
			for(let i = 0; i < object.length; i++) {
				let path = [...keyPath, i];
				keys = Object.assign(keys, flattenObject(object[i], path, includeStrucutre));
			}
			break;

		default:
			addKey(object);
	}

	return keys;
};

export const copyStructure = (source, destination) =>
{
	const sourceKeys = flattenObject(source, [], true);

	for(let key in sourceKeys)
	{
		const destinationValue = readByPath(destination, key, true);

		if(destinationValue === undefined)
		{
			const originalValue = readByPath(source, key);

			switch (originalValue.constructor.name) {
				case "Object":
					writeByPath(destination, key, {});
					break;

				case "Array":
					writeByPath(destination, key, []);
					break;

				default:
					writeByPath(destination, key, "");
					break;
			}
		}
	}
};