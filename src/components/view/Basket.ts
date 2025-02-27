import { createElement, ensureElement } from '../../utils/utils';
import { UIComponent } from '../base/UIComponent';
import { EventEmitter } from '../base/events';

interface IBasket {
	cartItems: HTMLElement[];
	totalAmount: number;
}

export class Basket extends UIComponent<IBasket> {
	protected _basketList: HTMLElement;
	protected _totalAmount: HTMLElement;
	basketButton: HTMLElement;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);
		this.initializeElements();
		this.addEventListeners();
		this.cartItems = [];
	}

	private initializeElements(): void {
		this._basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._totalAmount = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
	}

	private addEventListeners(): void {
		this.basketButton.addEventListener('click', () => this.handleOrderOpen());
	}

	private handleOrderOpen(): void {
		this.events.emit('order:open');
	}

	set cartItems(items: HTMLElement[]) {
		if (items.length > 0) {
			this._basketList.replaceChildren(...items);
		} else {
			const emptyMessage = createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			});
			this._basketList.replaceChildren(emptyMessage);
		}
	}

	set totalAmount(total: number) {
		this.setText(this._totalAmount, `${total} синапсов`);
	}
}
