import { ensureElement } from '../../utils/utils';
import { UIComponent } from './UIComponent';
import { IEvents } from './events';

interface IValidationState {
	isValid: boolean;
	validationErrors: string[];
}

export class FormDataHandler<T> extends UIComponent<IValidationState> {
	protected _submitButton = ensureElement<HTMLButtonElement>(
		'button[type=submit]',
		this.element
	);
	protected _validationErrors = ensureElement<HTMLElement>(
		'.form__errors',
		this.element
	);

	constructor(protected element: HTMLFormElement, protected events: IEvents) {
		super(element);
		element.addEventListener('input', this.handleFieldUpdate);
		element.addEventListener('submit', this.handleFormSubmission);
	}

	private handleFieldUpdate = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		if (target.name && target.value !== undefined) {
			this.events.emit(`${this.element.name}.${target.name}:change`, {
				field: target.name as keyof T,
				value: target.value,
			});
		}
	};

	private handleFormSubmission = (evt: Event) => {
		evt.preventDefault();
		this.events.emit(`${this.element.name}:submit`);
	};

	set isValid(value: boolean) {
		this._submitButton.disabled = !value;
	}

	set validationErrors(value: string) {
		this.setText(this._validationErrors, value);
	}

	render(state: Partial<T> & IValidationState): HTMLFormElement {
		const { isValid, validationErrors, ...inputs } = state;
		super.render({ isValid, validationErrors });
		Object.assign(this, inputs);
		return this.element;
	}
}
