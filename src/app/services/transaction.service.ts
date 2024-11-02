import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ApiResponse } from "../models/api-response.interface";
import { IDepotData, ICreditData, IRetraitData, ITransaction, ITransfertData } from "../models/transaction.interface";
import { Observable } from "rxjs";
import { IParams } from "../models/interface";

@Injectable({
    providedIn: 'root'
})
export class TransactionService extends ApiService {

    getAllTransactions(params?: IParams): Observable<ApiResponse<ITransaction[]>> {
        return this.get('/transactions', params);
    }

    getTransactionsCurrentUser(params?: IParams): Observable<ApiResponse<ITransaction[]>> {
        return this.get('/transactions/current', params);
    }

    getTransactionById(id: string): Observable<ApiResponse<ITransaction>> {
        console.log(id);
        
        return this.get(`/transactions/${id}`);
    }

    depot(data: IDepotData): Observable<ApiResponse<ITransaction>> {
        return this.post("/transactions/deposit", data);
    }

    retrait(data: IRetraitData): Observable<ApiResponse<ITransaction>> {
        return this.post("/transactions/withdraw", data);
    }

    credit(data: ICreditData): Observable<ApiResponse<ITransaction>> {
        return this.post("/transactions/purchase", data);
    }

    transfert(data: ITransfertData): Observable<ApiResponse<{ sendTransaction: ITransaction, receiveTransaction: ITransaction }>> {
        return this.post("/transactions/transfer", data);
    }

}    
