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

  // Initializes the component with user data and retrieves the display name.
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.getDisplayName()
  }

  // updatePassword - Handles the update of the user's password.
  updatePassword(pwChangeForm: NgForm) {
    const newPassword = pwChangeForm.value.newPassword

    // Make a POST request to Firebase API for updating the password
    this.http.post(`${FIREBASE_IDENTITY_TOOLKIT_BASEURL}?key=${FIREBASE_KEY}`,
      {
        idToken: this.userData?.idToken,
        password: newPassword,
        returnSecureToken: true

      }).subscribe({
        next: (res) => {

          // Handle successful password change

          // Display a success notification
          this.snackBar.open('Password change successful! Please log in again.', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          // Log out the user
          this.onLogout()
        },
        error: (errorRes) => {
          // Handle password change errors
          console.log(errorRes);
          this.snackBar.open('An unknown error occurred! Password change failed.', 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      })
  }

  // updateName - Handles the update of the user's display name.
  updateName(updateNameForm: NgForm) {
    const displayName = updateNameForm.value.displayName;
    
    // Make a POST request to Firebase API for updating the display name
    this.http.post(`${FIREBASE_IDENTITY_TOOLKIT_BASEURL}?key=${FIREBASE_KEY}`,
      {
        idToken: this.userData?.idToken,
        displayName: displayName,
        returnSecureToken: true

      }).subscribe({
        next: (res) => {

          // Handle successful display name update

          // Display a success notification
          this.snackBar.open('Display Name updated successfully!', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          // Toggle the display name update field
          this.onUpdateName();

        },
        error: (errorRes) => {
          // Handle display name update errors
          console.log(errorRes);
          let errorMessage = '';
          if (!errorRes.error || !errorRes.error.error) {
            errorMessage = 'An unknown error occurred! Failed to update display name.'
          }
          else if (errorRes.error.error.message === 'INVALID_ID_TOKEN') {
            errorMessage = `The user's credential is no longer valid. The user must sign in again`
          }

          // Display error message
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      })

  }

  // getDisplayName - Retrieves the user's display name.
  getDisplayName() {

    // Make a POST request to Firebase API for looking up user details
    this.http.post<userDetailsResponse>(`${FIREBASE_LOOKUP_BASEURL}?key=${FIREBASE_KEY}`,
      {
        idToken: this.userData?.idToken,

      }).subscribe({
        next: (res) => {

          // Handle successful retrieval of user details
          console.log('res', res)
          this.userName = res.users[0].displayName;
  
        },
        error:(errorRes) => {

          // Handle error in retrieving user details
          console.log('errorRes of getDisplayName', errorRes);
          let errorMessage = '';
          if (!errorRes.error || !errorRes.error.error) {
            errorMessage = 'An unknown error occurred! Failed to display username.'
          }
          else if (errorRes.error.error.message === 'INVALID_ID_TOKEN') {
            errorMessage = `The user's credential is no longer valid. The user must sign in again`

            // Log out the user if the token is not valid.
            this.onLogout();
          }

          // Display error message
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
  
        }
      })
  }

  // Logs out the user by removing user data from local storage and navigating to the login page.
  onLogout() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  // Toggles the visibility of the display name update field.
  onUpdateName() {
    this.showNameField = !this.showNameField
  }

  // Toggles the visibility of the password change field.
  onChangePassword() {
    this.showPasswordField = !this.showPasswordField
  }
}
