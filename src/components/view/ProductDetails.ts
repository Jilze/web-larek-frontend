import { ensureElement } from '../../utils/utils';
import { ProductCard } from './ProductCard';
import { CardInteractionHandlers } from '../../types';

interface IProductDetails {
	text: string;
}

export class ProductDetails extends ProductCard<IProductDetails> {
	protected _text: HTMLElement;
	protected _button: HTMLElement;

	constructor(element: HTMLElement, eventHandlers?: CardInteractionHandlers) {
		super(element, eventHandlers);
		this._text = ensureElement<HTMLElement>('.card__text', element);
		this._button = element.querySelector('.card__button');
		if (eventHandlers?.onClick && this._button) {
			element.removeEventListener('click', eventHandlers.onClick);
			this._button.addEventListener('click', eventHandlers.onClick);
		}
	}

	set text(value: string) {
		this.setText(this._text, value);
	}
}
