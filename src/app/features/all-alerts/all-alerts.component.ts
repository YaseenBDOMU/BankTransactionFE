import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from '../../core/models/alert.model';
import { AlertService } from '../../core/services/alert.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './all-alerts.component.html',
  styleUrl: './all-alerts.component.scss'
})
export class AllAlertsComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'alertCode', 'createdDate', 'severity', 'status', 
    'description', 'assignedToUserId', 'detectionPattern', 'riskScore'
  ];
  dataSource = new MatTableDataSource<Alert>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private alertService: AlertService, private router: Router) {}

  ngOnInit(): void {
    this.alertService.getPendingAlerts().subscribe(data => {
      this.dataSource.data = data.map(alert => ({
        ...alert,
        createdDate: new Date(alert.createdDate)
      }));

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  viewAlert(alertId: number): void {
    this.router.navigate(['/alerts', alertId]); 
  }
}
