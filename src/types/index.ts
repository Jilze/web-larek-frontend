export interface IAppState {
	productCatalog: IProduct[];
	selectedPreview: string;
	cartItems: string[];
	currentOrder: IOrder;
	totalAmount: number;
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderDetails {
	payment: string;
	email: string;
	phone: string;
	address: string;
}

export interface IOrder extends IOrderDetails {
	items: string[];
	total: number;
}

export type OrderFormErrors = Partial<Record<keyof IOrderDetails, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface CardInteractionHandlers {
	onClick: (event: MouseEvent) => void;
	onDoubleClick?: (event: MouseEvent) => void;
}
