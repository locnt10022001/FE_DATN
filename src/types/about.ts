interface IAbout {
    _id: string;
    key: string;
    name: string,
    email: string,
    phone: number,
    address: string,
    image: string,
    description: string,
    content: string,
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null,
}
export default IAbout