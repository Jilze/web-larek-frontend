import { DataNotifier } from './DataNotifier';
import { IProduct } from '../../types';

export class ProductItem extends DataNotifier<IProduct> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}
