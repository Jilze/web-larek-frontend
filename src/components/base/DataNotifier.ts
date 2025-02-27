import { IEvents } from './events';

export abstract class DataNotifier<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitEvent(event: string, params: object = {}): void {
		this.events.emit(event, params);
	}
}
