export default interface IhashTag {
    _id: string;
    key: string;
    name: string,
    products: Product[],
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null,
}

export interface Product {
    _id: string;
    name: string;
    price: string;
    images: string[];
    description: string;
    tags: Tag[];
    CategoryId: Category[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null,
}

interface Tag {
    _id: string;
    name: string;
    products: string[];
    createdAt: string;
    updatedAt: string;
}

interface Comment {
    _id: string;
    content: string;
    author: string;
    product: string;
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