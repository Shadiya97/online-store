import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Check if the item is present in local storage
    if (localStorage.getItem('userData')) {
      return true; // Allow navigation
    } else {
      // Redirect to a specific route or show an error message
      this.router.navigate(['/login']);
      return false; // Block navigation
    }
  }
}
