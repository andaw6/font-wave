import { BillStatus } from "../enums/BillStatus";

import { IUser } from "./user.interface";

export interface IBill {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    type: string;
    dueDate: Date;
    status: BillStatus;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
} 