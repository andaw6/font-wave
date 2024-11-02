import { UserRole } from "../enums/UserRole";
import { IAccount } from "./account.interface";
import { IBill } from "./bill.interface";
import { IContact } from "./contact.interface";
import { INotification } from "./notification.interface";
import { IPersonalInfo } from "./personal-info.interface";
import { ITransaction } from "./transaction.interface";

export interface IUser {
    id: string;
    name: string;
    email?: string;
    password: string;
    phoneNumber: string;
    isActive: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    transactions?: ITransaction[]; // Sender transactions
    received?: ITransaction[];     // Receiver transactions
    bills?: IBill[];
    account?: IAccount;
    notifications?: INotification[];
    contacts?: IContact[];
    personalInfo?: IPersonalInfo;
}     


export interface IUserTransaction{
    id: string;
    name: string;
    email?: string;
    phoneNumber: string;
    role?: UserRole;
}

export interface IUserSettings {    
    plafond: number;
    currency: string;
    name: string;
    id: string;
  }
  