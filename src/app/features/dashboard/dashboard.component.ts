import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { Alert } from '../../core/models/alert.model';
import { SignalrService } from '../../core/services/signalr.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  today!: Date;
  alerts: Alert[] = [];
  recentTransactions: Transaction[] = [];
  alertStats = {
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  };
  riskLevels = {
    high: 0,
    medium: 0,
    low: 0
  };
  lastBatchRun!: Date;  // Define lastBatchRun
  nextBatchRun!: Date;  // Define nextBatchRun

  constructor(
    private alertService: AlertService,
    private transactionService: TransactionService,
    private signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.today = new Date();
    this.loadDashboardData();

    // Start SignalR connection
    this.signalrService.startConnection().then(() => {
      console.log('SignalR connected');
    }).catch(err => {
      console.error('Error connecting to SignalR:', err);
    });

    // Subscribe to new alerts
    this.signalrService.newAlertReceived.subscribe(alert => {
      this.loadDashboardData();
    });

    // Subscribe to alert updates
    this.signalrService.alertUpdated.subscribe(update => {
      this.loadDashboardData();
    });

    // Set the batch run times (this could be updated with actual logic based on your data)
    this.lastBatchRun = new Date(); // Example: last batch run is the current time
    this.nextBatchRun = new Date();
    this.nextBatchRun.setMinutes(this.nextBatchRun.getMinutes() + 30); // Example: next batch run is 30 minutes later
  }

  loadDashboardData(): void {
    // Load pending alerts
    this.alertService.getPendingAlerts().subscribe(alerts => {
      this.alerts = alerts;
      
      // Calculate alert statistics
      this.alertStats.total = alerts.length;
      this.alertStats.new = alerts.filter(a => a.status === 'New').length;
      this.alertStats.inProgress = alerts.filter(a => a.status === 'InProgress').length;
      this.alertStats.resolved = alerts.filter(a => a.status === 'Resolved').length;
      this.alertStats.closed = alerts.filter(a => a.status === 'Closed').length;
      
      // Calculate risk levels
      this.riskLevels.high = alerts.filter(a => a.severity === 'High' || a.severity === 'Very High').length;
      this.riskLevels.medium = alerts.filter(a => a.severity === 'Medium' || a.severity === 'Medium-High').length;
      this.riskLevels.low = alerts.filter(a => a.severity === 'Low').length;
    });

    // Load recent transactions
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.transactionService.getTransactions(startDate, endDate).subscribe(transactions => {
      this.recentTransactions = transactions.slice(0, 10); // Get last 10 transactions
    });
  }
}

