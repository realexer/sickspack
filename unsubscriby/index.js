let _debug = false;

const enableDebug = (enable = true) =>
{
	_debug = enable;
};

class Unsubscriby
{
	constructor(onDestroy = () => {})
	{
		this.subscriptions = [];

		onDestroy(() => {
			this.finish();
		})
	}

	set add(callable) {
		this.addNamed(callable)
	}

	addNamed(callable, name, id)
	{
		this.subscriptions.push({
			callable,
			name,
			id,
			status: 'sub'
		});
	}

	addSingle(callable, name, id) {
		if(name && this.getByName(name))
			return;

		this.addNamed(callable(), name, id);
	}

	getByName(name)
	{
		return this.subscriptions.filter(item => item.name === name).shift();
	}

	getIdByName(name)
	{
		const sub = this.getByName(name);
		return sub ? sub.id : undefined;
	}

	stop(name)
	{
		const item = this.getByName(name);

		if(item) {
			this.stopItem(item);
		}
	}

	stopItem(item)
	{
		if(item.status === 'sub')
		{
			if(_debug) {
				console.debug(`Unsubscribing from: ${item.callable}`);
			}

			item.callable();
			item.status = 'done';
		}
	}

	finish() {
		this.subscriptions.forEach((item) => {
			this.stopItem(item);
		});

		this.subscriptions = [];
	}
}

export {Unsubscriby, enableDebug};