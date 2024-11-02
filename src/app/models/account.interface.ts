import { IUser } from "./user.interface";

export interface IAccount {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    qrCode: string;
    isActive: boolean;
    plafond?: number;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
  }
  