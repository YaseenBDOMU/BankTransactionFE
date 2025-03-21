import { AlertNote } from "./alert-note.model";
import { TransactionFlag } from "./transaction-flag.model";
import { User } from "./user.model";

export interface Alert {
    id: number;
    alertCode: string;
    createdDate: Date;
    severity: string;
    status: string;
    description: string;
    assignedToUserId?: number;
    assignedToUser?: User;
    detectionPattern: string;
    riskScore: number;
    relatedFlags?: TransactionFlag[];
    notes?: AlertNote[];
  }
  