import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { SignalrService } from './core/services/signalr.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from "./auth/login/login.component";
import { AlertDetailComponent } from "./features/alerts/alert-detail/alert-detail.component";
import { DashboardComponent } from "./features/dashboard/dashboard.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, SidenavComponent, LoginComponent, AlertDetailComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Bank Transaction Monitoring';
  showSidebar = true;
  
  constructor(
    private router: Router,
    private signalrService: SignalrService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Hide sidebar on login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showSidebar = !event.url.includes('/login');
      });
      
    // Start SignalR connection if user is logged in
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.signalrService.startConnection()
          .catch(err => console.error('Error connecting to SignalR:', err));
      } else {
        this.signalrService.stopConnection()
          .catch(err => console.error('Error disconnecting from SignalR:', err));
      }
    });
  }
}
