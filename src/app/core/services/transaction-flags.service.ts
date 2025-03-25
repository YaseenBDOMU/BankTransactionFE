import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionFlag } from '../models/transaction-flag.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionFlagsService {
  private apiUrl = `${environment.apiUrl}/api/transactionFlag`;

  constructor(private http: HttpClient) {}

  getTransactionFlag(): Observable<TransactionFlag[]> {
      return this.http.get<TransactionFlag[]>(this.apiUrl, {
        
      });
    }
    getTransactionFlagIds(): Observable<number[]> {
      return this.getTransactionFlag().pipe(
        map((flags: TransactionFlag[]) => flags.map(flag => flag.transactionId))
      );
    }
    
}
