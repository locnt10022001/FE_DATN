export interface IProduct {
  _id: string;
  key: string;
  name: string;
  price: number;
  salePrice: number;
  images: string[];
  description: string;
  sizes: ISizes[];
  quantity: number;
  views: number;
  tags: Tag[];
  CategoryId: Category[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null,
}

export interface IProductDetail {
  data: IProduct;
  relatedProducts: IProduct[]
  message: string;
}

export interface ISizes {
  _id: string;
  size: number;
  quantity: number;
}

interface Tag {
  _id: string;
  name: string;
  products: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null,
}


interface Category {
  _id: string;
  name: string;
  products: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null,
}