import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { userDetailsResponse } from '../models/user-details.model';
import { FIREBASE_IDENTITY_TOOLKIT_BASEURL, FIREBASE_KEY, FIREBASE_LOOKUP_BASEURL } from '../constants/api-base-urls.constant';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  userData: any;
  showNameField = false;
  showPasswordField = false;
  userName!: string;

  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.getDisplayName()
  }

  updatePassword(pwChangeForm: NgForm) {
    const newPassword = pwChangeForm.value.newPassword

    this.http.post(`${FIREBASE_IDENTITY_TOOLKIT_BASEURL}?key=${FIREBASE_KEY}`,
      {
        idToken: this.userData?.idToken,
        password: newPassword,
        returnSecureToken: true

      }).subscribe({
        next: (res) => {

          this.snackBar.open('Password change successful! Please log in again.', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          this.onLogout()
        },
        error: (errorRes) => {
          console.log(errorRes);
          this.snackBar.open('An unknown error occurred! Password change failed.', 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      })
  }

  updateName(updateNameForm: NgForm) {
    const displayName = updateNameForm.value.displayName;
    
    this.http.post(`${FIREBASE_IDENTITY_TOOLKIT_BASEURL}?key=${FIREBASE_KEY}`,
      {
        idToken: this.userData?.idToken,
        displayName: displayName,
        returnSecureToken: true

      }).subscribe({
        next: (res) => {
          this.snackBar.open('Display Name updated successfully!', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.onUpdateName();

        },
        error: (errorRes) => {
          console.log(errorRes);
          let errorMessage = '';
          if (!errorRes.error || !errorRes.error.error) {
            errorMessage = 'An unknown error occurred! Failed to update display name.'
          }
          else if (errorRes.error.error.message === 'INVALID_ID_TOKEN') {
            errorMessage = `The user's credential is no longer valid. The user must sign in again`
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      })

  }

  getDisplayName() {
    this.http.post<userDetailsResponse>(`${FIREBASE_LOOKUP_BASEURL}?key=${FIREBASE_KEY}`,
      {
        idToken: this.userData?.idToken,

      }).subscribe({
        next: (res) => {
          console.log('res', res)
          this.userName = res.users[0].displayName;
  
        },
        error:(errorRes) => {
          console.log('errorRes of getDisplayName', errorRes);
          let errorMessage = '';
          if (!errorRes.error || !errorRes.error.error) {
            errorMessage = 'An unknown error occurred! Failed to display username.'
          }
          else if (errorRes.error.error.message === 'INVALID_ID_TOKEN') {
            errorMessage = `The user's credential is no longer valid. The user must sign in again`
            this.onLogout();
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
  
        }
      })
  }


  onLogout() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  onUpdateName() {
    this.showNameField = !this.showNameField
  }

  onChangePassword() {
    this.showPasswordField = !this.showPasswordField
  }
}
