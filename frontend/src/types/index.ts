export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  category: Category | null;
  price: number | null;
  compareAtPrice: number | null;
  imageUrl: string | null;
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  images: { url: string; altText: string | null }[];
  sizes: string[];
}

export interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: Category | null;
  variants: ProductVariantDto[];
  images: string[];
  price: number | null;
  compareAtPrice: number | null;
}

export interface BannerDto {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  collectionSlug: string;
  imageUrl: string;
  sortOrder: number;
}

export interface CollectionListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
}

export interface CollectionWithProducts {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  products: ProductListItem[];
}

export interface ProductReviewDto {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ProductReviewsResponse {
  reviews: ProductReviewDto[];
  totalReviews: number;
  averageRating: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export type AddressType = "Home" | "Work" | "Other";

export interface AddressDto {
  id: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  area: string;
  streetAddress: string;
  landmark: string | null;
  postalCode: string;
  addressType: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  addressId: string | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItemDto[];
  address?: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    area: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark: string | null;
    addressType: string;
  } | null;
}
