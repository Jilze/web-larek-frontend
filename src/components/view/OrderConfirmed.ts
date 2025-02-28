import { ensureElement } from '../../utils/utils';
import { UIComponent } from '../base/UIComponent';

interface IOrderConfirmed {
	totalAmount: number;
}

interface IActionHandler {
	handleSuccess: () => void;
}

export class OrderConfirmed extends UIComponent<IOrderConfirmed> {
	private _totalAmountElement: HTMLElement;
	private _closeButton: HTMLElement;

	constructor(element: HTMLElement, actions: IActionHandler) {
		super(element);
		this._totalAmountElement = this.getElement('.order-success__description');
		this._closeButton = this.getElement('.order-success__close');
		this.setupCloseButton(actions);
	}

	private getElement(selector: string): HTMLElement {
		return ensureElement<HTMLElement>(selector, this.rootElement);
	}

	private setupCloseButton(actions: IActionHandler): void {
		this._closeButton.addEventListener('click', actions.handleSuccess);
	}

	set totalAmount(value: string) {
		this._totalAmountElement.textContent = `Списано ${value} синапсов`;
	}
}
