import { IOrder, IOrderResult, IProduct } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class ProductOrderApi extends Api {
	cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts() {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({ ...item }));
		});
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
