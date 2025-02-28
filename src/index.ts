import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductOrderApi } from './components/application/ProductOrderApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState } from './components/application/AppState';
import { ProductGallery } from './components/view/ProductGallery';
import { ProductCard } from './components/view/ProductCard';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Order } from './components/view/Order';
import { IOrderDetails, IProduct } from './types';
import { ContactInformation } from './components/application/ContactInformation';
import { ProductDetails } from './components/view/ProductDetails';
import { BasketItem } from './components/view/BasketItem';
import { OrderConfirmed } from './components/view/OrderConfirmed';

const TEMPLATES = {
	success: ensureElement<HTMLTemplateElement>('#success'),
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
};

const eventEmitter = new EventEmitter();
const productOrderApi = new ProductOrderApi(CDN_URL, API_URL);
const appState = new AppState({}, eventEmitter);

const productGallery = new ProductGallery(document.body, eventEmitter);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	eventEmitter
);
const basket = new Basket(cloneTemplate(TEMPLATES.basket), eventEmitter);
const order = new Order(cloneTemplate(TEMPLATES.order), eventEmitter);
const contactInformation = new ContactInformation(
	cloneTemplate(TEMPLATES.contacts),
	eventEmitter
);

//Обработчики карточек товаров

function emitCardSelection(item: IProduct) {
	eventEmitter.emit('card:select', item);
}

function generateProductCard(item: IProduct) {
	const card = new ProductCard(cloneTemplate(TEMPLATES.cardCatalog), {
		onClick: () => emitCardSelection(item),
	});
	return card.render({
		name: item.title,
		category: item.category,
		imageUrl: item.image,
		cost: item.price,
	});
}

function generateProductPreview(item: IProduct) {
	const preview = new ProductDetails(cloneTemplate(TEMPLATES.cardPreview), {
		onClick:
			item.price !== null
				? () => eventEmitter.emit('card:add', item)
				: undefined,
	});
	preview.buttonDisabled = appState.isItemInCart(item) || item.price === null;
	return preview;
}

function renderModal(productPreview: ProductDetails, item: IProduct) {
	modal.render({
		modalContent: productPreview.render({
			name: item.title,
			category: item.category,
			imageUrl: item.image,
			cost: item.price,
			text: item.description,
		}),
	});
}

// Обработчики корзины
function refreshBasketState() {
	basket.setDisableState(basket.basketButton, appState.isBasketEmpty);
	basket.totalAmount = appState.calculateTotal();

	let i = 1;
	basket.cartItems = appState.basketItems.map((item) => {
		const card = new BasketItem(cloneTemplate(TEMPLATES.cardBasket), {
			onClick: () => eventEmitter.emit('card:remove', item),
		});
		return card.render({
			name: item.title,
			cost: item.price,
			index: i++,
		});
	});

	modal.render({ modalContent: basket.render() });
}

function clearBasket() {
	appState.clearCart();
	productGallery.counter = appState.basketItems.length;
	refreshBasketState();
}

// Обработчики заказа
function processValidationErrors(validationErrors: Partial<IOrderDetails>) {
	const { payment, address, phone, email } = validationErrors;

	order.isValid = !address && !payment;
	contactInformation.isValid = !phone && !email;

	order.validationErrors = Object.values({ address, payment })
		.filter(Boolean)
		.join('; ');
	contactInformation.validationErrors = Object.values({ phone, email })
		.filter(Boolean)
		.join('; ');
}

// Карточки товаров
eventEmitter.on('card:select', (item: IProduct) => {
	appState.updatePreview(item);
});

eventEmitter.on('preview:changed', (item: IProduct) => {
	const productPreview = generateProductPreview(item);
	renderModal(productPreview, item);
});

eventEmitter.on('card:add', (item: IProduct) => {
	appState.addItemToOrder(item);
	appState.addItemToCart(item);
	productGallery.counter = appState.basketItems.length;
	modal.closeModal();
});

// Обработчик удаления товара
eventEmitter.on('card:remove', (item: IProduct) => {
	appState.removeItemFromCart(item);
	productGallery.counter = appState.basketItems.length;
});

// Корзина
eventEmitter.on('basket:open', refreshBasketState);
eventEmitter.on('card:remove', (item: IProduct) => {
	appState.removeItemFromCart(item);
	appState.removeItemFromOrder(item);
	productGallery.counter = appState.basketItems.length;
	refreshBasketState();
});

// Валидация форм
eventEmitter.on('formErrors:change', processValidationErrors);

// Изменение полей ввода
eventEmitter.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderDetails; value: string }) =>
		appState.updateContactsField(data.field, data.value)
);

eventEmitter.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderDetails; value: string }) =>
		appState.updateOrderField(data.field, data.value)
);

// Способ оплаты
eventEmitter.on('payment:change', (button: HTMLButtonElement) => {
	appState.currentOrder.payment = button.name;
});

// Оформление заказа
eventEmitter.on('order:open', () => {
	order.deliveryAddress = appState.currentOrder.address;
	order.paymentMethod = appState.currentOrder.payment;
	appState.validateOrder();
	modal.render({
		modalContent: order.render({
			address: appState.currentOrder.address,
			payment: appState.currentOrder.payment,
			isValid: Object.keys(appState.orderFormErrors).length === 0, // Актуализируем статус кнопки
			validationErrors: [],
		}),
	});
});

eventEmitter.on('order:submit', () => {
	contactInformation.contactNumber = appState.currentOrder.phone;
	contactInformation.emailAddress = appState.currentOrder.email;
	const isValid = appState.validateContacts();
	modal.render({
		modalContent: contactInformation.render({
			email: appState.currentOrder.email,
			phone: appState.currentOrder.phone,
			isValid: isValid,
			validationErrors: [],
		}),
	});
});

eventEmitter.on('contacts:submit', () => {
	productOrderApi.createOrder(appState.currentOrder).then(() => {
		clearBasket();
		modal.render({
			modalContent: new OrderConfirmed(cloneTemplate(TEMPLATES.success), {
				handleSuccess: () => {
					clearBasket();
					modal.closeModal();
				},
			}).render({ totalAmount: appState.currentOrder.total }),
		});
	});
});

eventEmitter.on('cart:changed', () => {
	if (appState.selectedPreview) {
		const currentItem = appState.productCatalog.find(
			(item) => item.id === appState.selectedPreview
		);
		if (currentItem) {
			const productPreview = generateProductPreview(currentItem);
			productPreview.buttonDisabled = appState.isItemInCart(currentItem);
			renderModal(productPreview, currentItem);
		}
	}
	refreshBasketState();
});

// Блокировка прокрутки

eventEmitter.on('modal:open', () => (productGallery.togglePageLock = true));
eventEmitter.on('modal:close', () => (productGallery.togglePageLock = false));
// Загрузка данных
productOrderApi.getProducts().then(appState.updateCatalog.bind(appState));

// Обновление каталога

eventEmitter.on('items:changed', () => {
	productGallery.items = appState.productCatalog.map(generateProductCard);
});
