export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export interface IOrder {
	paymentMethod: PaymentMethod;
	emailAddress: string;
	contactNumber: string;
	deliveryAddress: string;
	orderTotal: string | number;
	items: IProduct[];
}

type OrderForm = Omit<IOrder, 'total' | 'items'> & {
	items: string[];
	total: number;
};

export type PaymentMethod = 'cash' | 'card';

type OrderFormErrors = Partial<Record<keyof OrderForm, string>>;

export interface IOrderResult {
	orderId: string;
	totalAmount?: number;
}
