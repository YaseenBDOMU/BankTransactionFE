import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { map, switchMap } from 'rxjs/operators';
import { TransactionFlagsService } from './transaction-flags.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/api/transactions`;

  constructor(private http: HttpClient, private transactionFlagsService: TransactionFlagsService) { }

  getTransactions(startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`);
  }

  getTransactionsByCustomer(customerId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getTransactionsForChart(startDate: Date, endDate: Date): Observable<{ [key: string]: { suspicious: number, nonSuspicious: number } }> {
    return this.transactionFlagsService.getTransactionFlagIds().pipe(
      switchMap((flaggedTransactionIds: number[]) =>
        this.getTransactions(startDate, endDate).pipe(
          map(transactions => {
            const groupedData: { [key: string]: { suspicious: number, nonSuspicious: number } } = {};
  
            transactions.forEach(transaction => {
              const paymentType = transaction.paymentType;
              const isSuspicious = flaggedTransactionIds.includes(transaction.id);
              if (!groupedData[paymentType]) {
                groupedData[paymentType] = { suspicious: 0, nonSuspicious: 0 };
              }
  
              if (isSuspicious) {
                groupedData[paymentType].suspicious++;
              } else {
                groupedData[paymentType].nonSuspicious++;
              }
            });
  
            console.log('Grouped Data:', groupedData); 
            return groupedData;
          })
        )
      )
    );
  }
  
  getPaymentTypesByTransactionIds(transactionIds: number[]): Observable<{ [transactionId: number]: string }> {
    return this.getTransactionsByIds(transactionIds).pipe(
      map(transactions => {
        const paymentTypeMap: { [transactionId: number]: string } = {};
        transactions.forEach(transaction => {
          paymentTypeMap[transaction.id] = transaction.paymentType;
        });
        return paymentTypeMap;
      })
    );
  }
  
  getTransactionsByIds(transactionIds: number[]): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/byIds`, {
      params: { transactionIds: transactionIds.join(',') }
    });
  }
}

