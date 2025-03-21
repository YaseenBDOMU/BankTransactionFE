import { User } from "./user.model";

export interface AlertNote {
    id: number;
    alertId: number;
    content: string;
    createdDate: Date;
    createdByUserId: number;
    createdByUser?: User;
  }
  