import { Alert } from "./alert.model";
import { Transaction } from "./transaction.model";

export interface TransactionFlag {
    id: number;
    transactionId: number;
    transaction?: Transaction;
    flagType: string;
    description: string;
    createdDate: Date;
    severity: number;
    alertId?: number;
    alert?: Alert;
    detectionPattern: string;
  }
  