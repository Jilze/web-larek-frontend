import { ensureElement } from '../../utils/utils';
import { UIComponent } from '../base/UIComponent';
import { IEvents } from '../base/events';

interface IModal {
	modalContent: HTMLElement;
}

export class Modal extends UIComponent<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _modalContent: HTMLElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);
		this.initializeElements();
		this.addEventListeners();
	}

	private initializeElements(): void {
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.rootElement
		);
		this._modalContent = ensureElement<HTMLElement>(
			'.modal__content',
			this.rootElement
		);
	}

	private addEventListeners(): void {
		this._closeButton.addEventListener('click', this.closeModal.bind(this));
		this.rootElement.addEventListener('click', this.closeModal.bind(this));
		this._modalContent.addEventListener('click', (event) =>
			event.stopPropagation()
		);
	}

	set modalContent(value: HTMLElement) {
		this._modalContent.replaceChildren(value);
	}

	openModal(): void {
		this.rootElement.classList.add('modal_active');
		``;
		this.events.emit('modal:open');
	}

	closeModal(): void {
		this.rootElement.classList.remove('modal_active');
		this.modalContent = null;
		this.events.emit('modal:close');
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.openModal();
		return this.rootElement;
	}
}
