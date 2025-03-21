import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser) {
      // Check if route requires specific role
      if (route.data['roles'] && !this.hasRole(currentUser, route.data['roles'])) {
        // User doesn't have required role, redirect to home
        this.router.navigate(['/']);
        return false;
      }
      
      // Authorized
      return true;
    }
    
    // Not logged in, redirect to login with return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  private hasRole(user: any, roles: string[]): boolean {
    return roles.includes(user.role);
  }
}
