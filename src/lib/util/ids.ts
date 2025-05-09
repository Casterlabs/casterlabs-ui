export declare type Id = any;

export declare interface IdGenerator {
	generate(): Id;
}

export class NumericalIdGenerator implements IdGenerator {
	private idx: number;

	constructor() {
		this.idx = 0;
	}

	generate(): number {
		return this.idx++;
	}
}
