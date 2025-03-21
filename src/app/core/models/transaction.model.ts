import { Account } from "./account.model";
import { TransactionFlag } from "./transaction-flag.model";

export interface Transaction {
    id: number;
    transactionDate: Date;
    processingDate: Date;
    referenceNumber: string;
    amount: number;
    currency: string;
    receivedCurrency: string;
    senderAccountId: number;
    senderAccount?: Account;
    receiverAccountId: number;
    receiverAccount?: Account;
    senderBankLocation: string;
    receiverBankLocation: string;
    paymentType: string;
    transactionType: string;
    isCleared: boolean;
    description: string;
    flags?: TransactionFlag[];
    sourceSystem: string;
  }
  