import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { Alert } from '../../core/models/alert.model';
import { SignalrService } from '../../core/services/signalr.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Chart } from 'chart.js/auto';

import { Router } from '@angular/router';
import { TransactionFlagsService } from '../../core/services/transaction-flags.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AfterViewInit } from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-dashboard',
  template: ` <ng-lottie [options]="options" (animationCreated)="animationCreated($event)" /> `,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatGridListModule, MatProgressSpinnerModule, LottieComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [TransactionService]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  options: AnimationOptions = {
    path: 'assets/Animation - 1742975662208.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  isLoading = true;
  chart!: Chart;
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
  lastBatchRun!: Date;
  nextBatchRun!: Date;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private signalrService: SignalrService,
    private transactionFlagsService: TransactionFlagsService,
  ) { }

  ngOnInit(): void {
    this.today = new Date();
    this.loadDashboardData();
    
    this.loadTransactionData();

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

  ngAfterViewInit(): void {
    // Ensure the chart is only created after the view is fully initialized.
    if (!this.isLoading && this.recentTransactions.length > 0) {
      this.loadTransactionData();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.alertService.getPendingAlerts().subscribe(alerts => {
      this.alerts = alerts;

      this.alertStats.total = alerts.length;
      this.alertStats.new = alerts.filter(a => a.status === 'New').length;
      this.alertStats.inProgress = alerts.filter(a => a.status === 'InProgress').length;
      this.alertStats.resolved = alerts.filter(a => a.status === 'Resolved').length;
      this.alertStats.closed = alerts.filter(a => a.status === 'Closed').length;

      this.riskLevels.high = alerts.filter(a => a.severity === 'High' || a.severity === 'Very High').length;
      this.riskLevels.medium = alerts.filter(a => a.severity === 'Medium' || a.severity === 'Medium-High').length;
      this.riskLevels.low = alerts.filter(a => a.severity === 'Low').length;

      this.isLoading = false;
    });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.transactionService.getTransactions(startDate, endDate).subscribe(transactions => {
      this.recentTransactions = transactions.slice(0, 10); // Get last 10 transactions
      this.isLoading = false;
    });
  }

  goToAlerts() {
    console.log("I am here");
    this.router.navigate(['/alerts']);
  }
  goToTransactions() {
    this.router.navigate(['/transactions']);
  }

  loadTransactionData(): void {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
  
    this.transactionService.getTransactionsForChart(startDate, endDate).subscribe(data => {
      console.log("Data fetched for chart:", data); 
      if (data) {
        this.createChart(data);
        this.isLoading = false;
      } else {
        this.isLoading = false;
        console.error('No data for chart');
      }
    }, error => {
      console.error("Error fetching transaction data", error);
      this.isLoading = false;
    });
  }
  

  createChart(data: { [key: string]: { suspicious: number, nonSuspicious: number } }): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(data);
    const suspiciousData = labels.map(label => data[label].suspicious);
    const nonSuspiciousData = labels.map(label => data[label].nonSuspicious);

    this.chart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Suspicious Transactions',
            data: suspiciousData,
            backgroundColor: 'red'
          },
          {
            label: 'Non-Suspicious Transactions',
            data: nonSuspiciousData,
            backgroundColor: '#82ca9d'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }


}

