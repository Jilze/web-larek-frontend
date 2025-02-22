export interface IApplicationState {
	productCatalog: IProduct[];
	selectedPreview: string;
	cartItems: string[];
	currentOrder: IOrder;
	totalAmount: number;
}

export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export interface IProductsCollection {
	collection: IProduct[];
}

type OrderForm = Omit<IOrder, 'total' | 'items'>;

export interface IOrder {
	paymentMethod: string;
	emailAddress: string;
	contactNumber: string;
	deliveryAddress: string;
	orderTotal: string | number;
	items: string[];
}

type OrderFormErrors = Partial<Record<keyof OrderForm, string>>;

export interface IOrderResponse {
	orderId: string;
	totalAmount?: number;
}

export interface ICardEventHandlers {
	onClick: (event: MouseEvent) => void;
	onDoubleClick?: (event: MouseEvent) => void;
}
