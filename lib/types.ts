export interface ResponseServer {
  error: boolean
  msg: string
  result: any
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Image {
  small: string
  large: string
  edit?: boolean
}

export interface ProductImages extends Image {
  _id: string
  color: string | null
}

interface Attribute {
  images: ProductImages[]
  size: string[] | []
}

export interface Category {
  _id: string
  categoryName: string
  images: Image
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface TProduct {
  _id: string;
  slug: string;
  productName: string;
  category: string
  description: string
  rating: number;
  price: number;
  salePrice: number;
  attributes: Attribute
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface TCart extends TProduct {
  cartProductId: string;
  productId: string;
  quantity: number
  productImage: string
  color: string
  size: string
}

export interface TOrderDetail {
  _id: string;
  orderId: string;
  userId: string;
  products: TCart[];
  totalQuantity?: number;
  quantity: number;
  total: number;
  createdAt: Date;
}

export interface TUserContext {
  user: any;
  setUser: (user: User) => void;
}
