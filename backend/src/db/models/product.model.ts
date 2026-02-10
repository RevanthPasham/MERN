export interface Product {
  id?: string;
  name: string;
  description?: string;
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
  updatedAt?: Date;
}

export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  categories: string[];
  price: number[];
  discount: number[];
  links: string[];
  images: string[];
  size_chart: any;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
