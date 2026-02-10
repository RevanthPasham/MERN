export interface Product {
  id?: number;

  name: string;
  description: string;

  categories: string[];

  price: number[];
  discount: number[];

  links: string[];
  images: string[];

  sizeChart: {
    size: string;
    chest: number;
    length: number;
  }[];

  isActive: boolean;
  createdAt?: Date;
}
