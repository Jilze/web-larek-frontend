export interface IApplicationState {
	productCatalog: IProduct[];
	selectedPreview: string;
	cartItems: string[];
	currentOrder: IOrder;
	totalAmount: number;
}

export interface IProduct {
	id: string;
	name: string;
	details: string;
	category: string;
	imageUrl: string;
	cost: number | null;
}

export interface IProductsCollection {
	collection: IProduct[];
}

export interface IOrderDetails {
	success: boolean;
	message: string;
	data: {
		paymentMethod?: string;
		deliveryAddress?: string;
		contactNumber?: string;
		emailAddress?: string;
		orderTotal?: string | number;
		items: string[];
		status?: string;
	};
}

export interface IOrder extends IOrderDetails {
	items: string[];
}

export type OrderFormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResponse {
	orderId: string;
}

export interface ICardEventHandlers {
	onClick: (event: MouseEvent) => void;
	onDoubleClick?: (event: MouseEvent) => void;
}
