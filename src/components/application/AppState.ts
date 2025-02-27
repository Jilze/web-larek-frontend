import {
	IAppState,
	IOrder,
	IOrderDetails,
	IProduct,
	OrderFormErrors,
} from '../../types';
import { DataNotifier } from '../base/DataNotifier';
import { ProductItem } from '../base/ProductItem';

export class AppState extends DataNotifier<IAppState> {
	productCatalog: ProductItem[] = [];
	selectedPreview: string = '';
	cartItems: ProductItem[] = [];
	currentOrder: IOrder = {
		address: '',
		payment: '',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};
	orderFormErrors: OrderFormErrors = {};

	clearCart() {
		this.cartItems = [];
		this.currentOrder.items = [];
	}

	addItemToOrder(item: ProductItem) {
		if (item && item.id && item.price !== null)
			this.currentOrder.items.push(item.id);
	}

	removeItemFromOrder(item: ProductItem) {
		this.currentOrder.items = this.currentOrder.items.filter(
			(id) => id !== item.id
		);
	}

	updateCatalog(items: IProduct[]) {
		this.productCatalog = items.map(
			(item) => new ProductItem(item, this.events)
		);
		this.emitEvent('items:changed', { catalog: this.productCatalog });
	}

	updatePreview(item: ProductItem) {
		this.selectedPreview = item.id;
		this.emitEvent('preview:changed', item);
	}

	addItemToCart(item: ProductItem) {
		this.cartItems.push(item);
	}

	removeItemFromCart(item: ProductItem) {
		this.cartItems = this.cartItems.filter((cartItem) => cartItem !== item);
	}

	get isBasketEmpty() {
		return this.cartItems.length === 0;
	}

	get basketItems() {
		return this.cartItems;
	}

	calculateTotal(): number {
		return this.currentOrder.items.reduce((total, itemId) => {
			const product = this.productCatalog.find((p) => p.id === itemId);
			return total + (product?.price ?? 0);
		}, 0);
	}

	updateOrderField(field: keyof IOrderDetails, value: string) {
		this.currentOrder[field] = value;
		if (this.validateOrder())
			this.events.emit('order:ready', this.currentOrder);
	}

	updateContactsField(field: keyof IOrderDetails, value: string) {
		this.currentOrder[field] = value;
		if (this.validateContacts())
			this.events.emit('order:ready', this.currentOrder);
	}

	validateOrder(): boolean {
		const errors: OrderFormErrors = {};
		if (!this.currentOrder.address)
			errors.address = 'Необходимо указать адрес.';
		if (!this.currentOrder.payment)
			errors.payment = 'Необходимо выбрать способ оплаты.';
		this.updateErrors(errors);
		return !Object.keys(errors).length;
	}

	validateContacts(): boolean {
		const errors: OrderFormErrors = {};
		if (!this.currentOrder.email) errors.email = 'Необходимо указать email.';
		if (!this.currentOrder.phone) errors.phone = 'Необходимо указать телефон.';
		this.updateErrors(errors);
		return !Object.keys(errors).length;
	}

	private updateErrors(errors: OrderFormErrors) {
		this.orderFormErrors = errors;
		this.emitEvent('formErrors:change', this.orderFormErrors);
	}
}
