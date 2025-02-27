export abstract class UIComponent<T> {
	protected constructor(protected readonly rootElement: HTMLElement) {}

	setDisableState(element: HTMLElement, isDisabled: boolean): void {
		if (isDisabled) {
			element.setAttribute('disabled', 'disabled');
		} else {
			element.removeAttribute('disabled');
		}
	}

	protected setText(element: HTMLElement, content: unknown): void {
		element.textContent = String(content);
	}

	protected setPicture(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.rootElement;
	}
}
