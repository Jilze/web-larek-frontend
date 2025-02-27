import { UIComponent } from '../base/UIComponent';
import { CardInteractionHandlers } from '../../types';
import { ensureElement } from '../../utils/utils';

interface IProductsBasket {
	name: string;
	cost: number;
	index: number;
}

export class BasketItem extends UIComponent<IProductsBasket> {
	private _name: HTMLElement;
	private _cost: HTMLElement;
	private _button?: HTMLElement;
	private _index: HTMLElement;

	constructor(element: HTMLElement, eventHandlers?: CardInteractionHandlers) {
		super(element);
		this._name = ensureElement<HTMLElement>('.card__title', element);
		this._cost = ensureElement<HTMLElement>('.card__price', element);
		this._index = ensureElement<HTMLElement>('.basket__item-index', element);
		this._button = element.querySelector('.card__button') ?? undefined;
		if (this._button && eventHandlers?.onClick) {
			this._button.addEventListener('click', eventHandlers.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set name(value: string) {
		this.setText(this._name, value);
	}

	set cost(value: string | null) {
		this.setText(this._cost, value ? `${value} синапсов` : 'Бесценно');
	}
}
