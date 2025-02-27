import { ensureElement } from '../../utils/utils';
import { UIComponent } from '../base/UIComponent';
import { CardInteractionHandlers } from '../../types';

interface IProductCard {
	name: string;
	category: string;
	imageUrl: string;
	cost: number | null;
	text: string;
}

export class ProductCard<T> extends UIComponent<IProductCard> {
	protected _name: HTMLElement;
	protected _category: HTMLElement;
	protected _imageUrl: HTMLImageElement;
	protected _cost: HTMLElement;

	private readonly _colorType: Record<string, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(
		element: HTMLElement,
		private eventHandlers?: CardInteractionHandlers
	) {
		super(element);
		this._name = ensureElement<HTMLElement>('.card__title', this.rootElement);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.rootElement
		);
		this._imageUrl = ensureElement<HTMLImageElement>(
			'.card__image',
			this.rootElement
		);
		this._cost = ensureElement<HTMLElement>('.card__price', this.rootElement);

		if (eventHandlers?.onClick) {
			element.addEventListener('click', eventHandlers.onClick);
		}
	}

	set name(value: string) {
		this.setText(this._name, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.applyCategoryStyle(value);
	}

	set imageUrl(value: string) {
		this.setPicture(this._imageUrl, value);
	}

	set cost(value: number | null) {
		const displayValue = value === null ? 'Бесценно' : `${value} синапсов`;
		this.setText(this._cost, displayValue);
	}

	private applyCategoryStyle(category: string): void {
		const colorClass = this._colorType[category] || '';
		this._category.className = `card__category card__category_${colorClass}`;
	}
}
