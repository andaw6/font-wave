import { IUser } from "./user.interface";

export interface IContact {
    id?: string;
    userId: string;
    name: string;
    phoneNumber: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    user?: IUser;
    favorite: boolean;
}   