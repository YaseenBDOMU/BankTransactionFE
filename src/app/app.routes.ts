import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AlertDetailComponent } from './features/alerts/alert-detail/alert-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AllAlertsComponent } from './features/all-alerts/all-alerts.component';

// export const routes: Routes = [
//   { 
//     path: 'alerts', 
//     component: AllAlertsComponent, 
//     canActivate: [AuthGuard] 
//   },
//   { path: 'login', component: LoginComponent },
//     { 
//       path: '', 
//       component: DashboardComponent, 
//       canActivate: [AuthGuard] 
//     },
//     { 
//       path: 'alerts/:id', 
//       component: AlertDetailComponent, 
//       canActivate: [AuthGuard] 
//     },
//     // { 
//     //   path: 'alerts', 
//     //   component: AllAlertsComponent, 
//     //   canActivate: [AuthGuard] 
//     // },
//     { 
//       path: 'transactions', 
//       component: TransactionListComponent, 
//       canActivate: [AuthGuard] 
//     },
//     { path: '**', redirectTo: '' }
// ];

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'alerts/:id', component: AlertDetailComponent }, 
    { path: 'alerts', component: AllAlertsComponent },
    { path: 'transactions', component: TransactionListComponent },
    { path: '**', redirectTo: '' }
  ];