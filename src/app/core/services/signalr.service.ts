import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection;
  public newAlertReceived = new Subject<any>();
  public alertUpdated = new Subject<any>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/alerts`)
      .build();

    this.hubConnection.on('ReceiveNewAlert', (alertId, description, severity) => {
      this.newAlertReceived.next({ alertId, description, severity });
    });

    this.hubConnection.on('ReceiveAlertUpdate', (alertId, status) => {
      this.alertUpdated.next({ alertId, status });
    });
  }

  startConnection(): Promise<void> {
    return this.hubConnection.start();
  }

  stopConnection(): Promise<void> {
    return this.hubConnection.stop();
  }
}
