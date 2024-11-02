import { TransactionStatus } from "../enums/TransactionStatus";
import { TransactionType } from "../enums/TransactionType";
import { IUser, IUserTransaction } from "./user.interface";

export interface ITransaction {
    id: string;
    amount: number;
    senderId: string;
    receiverId: string;
    feeAmount: number;
    currency: string;
    transactionType: TransactionType;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    sender: IUser;
    receiver: IUser;
    creditPurchase: ICreditPurchaseTransaction;
}


export interface ITransactionItem {
    id: string;
    amount: number;
    feeAmount: number;
    currency: string;
    user: IUser | IUserTransaction;
    transactionType: TransactionType;
    status: string;
    createdAt: Date;
}

export interface ITransactionDetail {
    transactionId: string;
    status: TransactionStatus;
    type: TransactionType;
    amount: number;
    currency: string;
    date: Date;
    beneficiary: IBeneficiaryDetail;
    history: ITransactionHistoryItem[];
}

export interface IBeneficiaryDetail {
    name: string;
    email?: string;
    phone: string;
}

export interface ITransactionHistoryItem {
    description: string;
    date: Date;
    icon?: string;
}

export interface ICreditPurchaseTransaction {
    id: string;
    transactionId: string;
    receiverName: string | null;
    receiverPhoneNumber: string | null;
    receiverEmail?: string | null;
    createdAt: Date;
    updatedAt: Date;
    transaction: ITransaction;
}


// Interface pour les transactions de dépôt
export interface IDepotData {
    amount: number;
    receiverPhoneNumber: string;
    feeAmount: number;
}

export interface IRetraitData {
    amount: number;
    senderPhoneNumber: string;
    feeAmount: number; // Correction de l'orthographe
}

export interface ICreditData {
    amount: number;
    receiverName: string;
    receiverPhoneNumber: string;
    receiverEmail?: string; // Optionnel
    feeAmount: number; // Correction de l'orthographe
}

export interface ITransfertData {
    amount: number;
    receiverPhoneNumber: string;
    feeAmount: number; // Correction de l'orthographe
}

export interface ITransactionBaseData {
    amount: number;
    feeAmount: number; // Correction de l'orthographe
}
