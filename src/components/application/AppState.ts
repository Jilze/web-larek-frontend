import {
	IAppState,
	IOrder,
	IOrderDetails,
	IProduct,
	OrderFormErrors,
} from '../../types';
import { DataNotifier } from '../base/DataNotifier';

export class AppState extends DataNotifier<IAppState> {
	productCatalog: IProduct[] = [];
	selectedPreview: string = '';
	cartItems: IProduct[] = [];
	currentOrder: IOrder = {
		address: '',
		payment: 'card',
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

	addItemToOrder(item: IProduct) {
		if (item && item.id && item.price !== null) {
			this.currentOrder.items.push(item.id);
			this.currentOrder.total = this.calculateTotal();
		}
	}

	removeItemFromOrder(item: IProduct) {
		this.currentOrder.items = this.currentOrder.items.filter(
			(id) => id !== item.id
		);
		this.currentOrder.total = this.calculateTotal();
	}

	updateCatalog(items: IProduct[]) {
		this.productCatalog = items;
		this.emitEvent('items:changed', { catalog: this.productCatalog });
	}

	updatePreview(item: IProduct) {
		this.selectedPreview = item.id;
		this.emitEvent('preview:changed', item);
	}

	isItemInCart(item: IProduct): boolean {
		return this.cartItems.some((cartItem) => cartItem.id === item.id);
	}

	addItemToCart(item: IProduct) {
		if (!this.cartItems.some((cartItem) => cartItem.id === item.id)) {
			this.cartItems.push(item);
			this.emitEvent('cart:changed', this.cartItems);
		}
	}

	removeItemFromCart(item: IProduct) {
		this.cartItems = this.cartItems.filter(
			(cartItem) => cartItem.id !== item.id
		);
		this.emitEvent('cart:changed', this.cartItems);
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
		this.validateOrder();
		this.events.emit('order:ready', this.currentOrder);
	}

	updateContactsField(field: keyof IOrderDetails, value: string) {
		this.currentOrder[field] = value;
		this.validateContacts();
		this.events.emit('order:ready', this.currentOrder);
	}

	validateOrder(): boolean {
		const errors: OrderFormErrors = {};
		if (!this.currentOrder.address)
			errors.address = 'Необходимо указать адрес.';
		if (!this.currentOrder.payment)
			errors.payment = 'Необходимо выбрать способ оплаты.';
		this.updateErrors(errors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: OrderFormErrors = {};
		if (!this.currentOrder.email) errors.email = 'Необходимо указать email.';
		if (!this.currentOrder.phone) errors.phone = 'Необходимо указать телефон.';
		this.updateErrors(errors);
		return Object.keys(errors).length === 0;
	}

	private updateErrors(errors: OrderFormErrors) {
		this.orderFormErrors = errors;
		this.emitEvent('formErrors:change', this.orderFormErrors);
	}
}
