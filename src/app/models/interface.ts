import { UserRole } from "../enums/UserRole";

export interface DecodedToken {
    role: UserRole | null;
    userId: string | null;
}


export interface IParams {
    [key: string]: any
}

export interface OperatorInfo {
    name: string;
    operatorClass: string;
    textColorClass: string;
    gradientClass?: string;
}

export interface ErrorDisplay {
    title: string,
    message: string
}