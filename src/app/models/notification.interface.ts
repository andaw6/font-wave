import { NotificationStatus } from "../enums/NotificationStatus";
import { IUser } from "./user.interface";

export interface INotification {
    id: string;
    userId: string;
    message: string;
    isRead: NotificationStatus;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
}