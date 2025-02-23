export interface IApplicationState {
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

export interface IProductsCollection {
	collection: IProduct[];
}

export interface IOrderDetails {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
	total?: string | number;
}

export interface IOrder extends IOrderDetails {
	items: string[];
}

export type OrderFormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
