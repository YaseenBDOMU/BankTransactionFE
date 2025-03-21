import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';


@Component({
  selector: 'app-transaction-list',
  imports: [],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = false;
  error = '';
  filterForm: FormGroup;
  
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
    
    this.filteredTransactions = this.transactions.filter(txn => {
      // Apply min amount filter
      if (filters.minAmount && txn.amount < filters.minAmount) {
        return false;
      }
      
      // Apply max amount filter
      if (filters.maxAmount && txn.amount > filters.maxAmount) {
        return false;
      }
      
      // Apply payment type filter
      if (filters.paymentType && txn.paymentType !== filters.paymentType) {
        return false;
      }
      
      // Apply currency filter
      if (filters.currency && txn.currency !== filters.currency) {
        return false;
      }
      
      // Apply flags filter
      if (filters.hasFlagsOnly && (!txn.flags || txn.flags.length === 0)) {
        return false;
      }
      
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

