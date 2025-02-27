import { ensureElement } from '../../utils/utils';
import { UIComponent } from '../base/UIComponent';
import { IEvents } from '../base/events';

interface IProductGallery {
	items: HTMLElement[];
}

export class ProductGallery extends UIComponent<IProductGallery> {
	protected _counter: HTMLElement;
	protected _items: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this._items = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basket = ensureElement<HTMLElement>('.header__basket', container);

		this._basket.addEventListener('click', this.handleBasketClick);
	}

	private handleBasketClick = (): void => {
		this.events.emit('basket:open');
	};

	set counter(value: number) {
		const displayValue = Math.max(0, value); // Убедимся, что значение не отрицательное
		this.setText(this._counter, String(displayValue));
	}

	set items(elements: HTMLElement[]) {
		this._items.innerHTML = ''; // Очищаем текущие элементы
		if (elements.length > 0) {
			this._items.append(...elements); // Добавляем новые элементы
		}
	}

	set togglePageLock(isLocked: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', isLocked);
	}
}
