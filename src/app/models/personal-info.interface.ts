import { PersonalInfoStatus } from "../enums/PersonalInfoStatus";
import { IUser } from "./user.interface";

export interface IPersonalInfo {
    id: string;
    userId: string;
    documentType: string;
    idCardFrontPhoto?: string;
    idCardBackPhoto?: string;
    verificationStatus: PersonalInfoStatus;
    verifiedAt?: Date;
    verificationMethod?: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
}   