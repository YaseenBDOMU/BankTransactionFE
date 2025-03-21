import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AlertDetailComponent } from './features/alerts/alert-detail/alert-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'alerts', 
    component: AlertDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { path: 'login', component: LoginComponent },
    { 
      path: '', 
      component: DashboardComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'alerts/:id', 
      component: AlertDetailComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'alerts', 
      component: AlertDetailComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'transactions', 
      component: TransactionListComponent, 
      canActivate: [AuthGuard] 
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
