import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponseData } from '../models/auth-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FIREBASE_AUTH_BASEURL, FIREBASE_KEY } from '../constants/api-base-urls.constant';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent {

  errorMessage: string = null;

  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { }
  // onSubmit - Handles the form submission for user registration.
  onSubmit(registerform: NgForm) {

    // Check if the form is valid before proceeding
    if (!registerform.valid) {
      return;
    }

    // Extract email and password from the form values
    const email = registerform.value.email;
    const password = registerform.value.password;

    // Make a POST request to Firebase API for user registration
    this.http
      .post<AuthResponseData>(
        `${FIREBASE_AUTH_BASEURL}/signupNewUser?key=${FIREBASE_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).subscribe({
        next: (resData) => {

          // Handle successful registration
          console.log(resData);

          // Display a success notification
          this.snackBar.open('User registration successful! You can login now', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/login']);
        },
        error: (errorRes) => {
          // Handle registration errors
          console.log(errorRes);
          this.errorMessage = 'An unknown error occurred!';

          // Check if error response and specific error code are present
          if (!errorRes.error || !errorRes.error.error) {
            return
          }

          // Handle specific error cases
          switch (errorRes.error.error.message) {
            case 'INVALID_EMAIL':
              this.errorMessage = 'Invalid email address. Please check the email format and try again.';
              break;
            case 'EMAIL_EXISTS':
              this.errorMessage = 'This email exists already.';
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              this.errorMessage = 'An unusual activity has been detected from this device. Please try again later.';
              break;
          }
        }
      })
  }

  // Navigates to the login page when the "Switch to Login" button is clicked.
  onClickLogin() {
    this.router.navigate(['/login'])
  }

}
