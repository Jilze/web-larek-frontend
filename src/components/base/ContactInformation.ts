import { FormDataHandler } from './FormDataHandler';
import { IOrderDetails } from '../../types';
import { IEvents } from './events';

export class ContactInformation extends FormDataHandler<IOrderDetails> {
	constructor(element: HTMLFormElement, eventHandlers: IEvents) {
		super(element, eventHandlers);
	}

	set contactNumber(value: string) {
		(this.element.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set emailAddress(value: string) {
		(this.element.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
