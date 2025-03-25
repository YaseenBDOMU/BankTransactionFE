import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  dataSource = new MatTableDataSource<Transaction>();
  displayedColumns: string[] = ['transactionId', 'amount', 'paymentType', 'currency', 'date', 'flags'];
  loading = false;
  error = '';
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private transactionService: TransactionService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [new Date(new Date().setDate(new Date().getDate() - 30))],
      endDate: [new Date()],
      minAmount: [''],
      maxAmount: [''],
      paymentType: [''],
      currency: [''],
      hasFlagsOnly: [false]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadTransactions(): void {
    this.loading = true;
    const filters = this.filterForm.value;
    const startDate = filters.startDate || new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = filters.endDate || new Date();
    
    this.transactionService.getTransactions(startDate, endDate).subscribe(
      transactions => {
        this.transactions = transactions;
        this.dataSource = new MatTableDataSource(this.transactions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyFilters();
        this.loading = false;
      },
      error => {
        this.error = 'Error loading transactions';
        this.loading = false;
        console.error('Error loading transactions:', error);
      }
    );
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.dataSource.data = this.transactions.filter(txn => {
      if (filters.minAmount && txn.amount < filters.minAmount) return false;
      if (filters.maxAmount && txn.amount > filters.maxAmount) return false;
      if (filters.paymentType && txn.paymentType !== filters.paymentType) return false;
      if (filters.currency && txn.currency !== filters.currency) return false;
      if (filters.hasFlagsOnly && (!txn.flags || txn.flags.length === 0)) return false;
      return true;
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
      minAmount: '',
      maxAmount: '',
      paymentType: '',
      currency: '',
      hasFlagsOnly: false
    });
    this.loadTransactions();
  }
}
