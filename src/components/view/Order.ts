import { IOrderDetails } from '../../types';
import { ensureAllElements } from '../../utils/utils';
import { IEvents } from '../base/events';
import { FormDataHandler } from '../base/FormDataHandler';

export class Order extends FormDataHandler<IOrderDetails> {
	private _paymentButtons: HTMLButtonElement[];

	constructor(element: HTMLFormElement, events: IEvents) {
		super(element, events);
		this._paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			element
		);
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () =>
				this._handlePaymentButtonClick(button)
			);
		});
	}

	private _handlePaymentButtonClick(button: HTMLButtonElement): void {
		this.paymentMethod = button.name;
		this.events.emit('payment:change', button);
	}

	set paymentMethod(name: string) {
		// Убрана аннотация возвращаемого типа
		this._paymentButtons.forEach((button) => {
			const isActive = button.name === name;
			button.classList.toggle('button_alt-active', isActive);
		});
	}

	set deliveryAddress(value: string) {
		// Убрана аннотация возвращаемого типа
		const addressInput = this.element.elements.namedItem(
			'address'
		) as HTMLInputElement;
		if (addressInput) {
			addressInput.value = value;
		}
	}
}
