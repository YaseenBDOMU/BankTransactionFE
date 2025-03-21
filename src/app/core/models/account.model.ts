import { Customer } from "./customer.model";

export interface Account {
    id: number;
    accountNumber: string;
    accountName: string;
    accountType: string;
    isActive: boolean;
    openDate: Date;
    customerId: number;
    customer?: Customer;
    branch: string;
    riskCategory: string;
    riskScore: number;
  }
  