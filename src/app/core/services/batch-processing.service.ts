import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BatchProcessingService {
  private apiUrl = `${environment.apiUrl}/api/batchprocessing`;

  constructor(private http: HttpClient) { }

  runBatchProcess(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/run`, {});
  }
}
