export default class Debouncer {
	existingId: number;
	timeout: number;
	constructor(timeout = 300) {
		this.existingId = -1;
		this.timeout = timeout;
	}

	debounce(fun: () => void) {
		clearTimeout(this.existingId);
		this.existingId = setTimeout(fun, this.timeout);
	}
}
