import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponseData } from '../models/auth-response.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FIREBASE_AUTH_BASEURL, FIREBASE_KEY } from '../constants/api-base-urls.constant';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  errorMessage: string = null;

  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { }
// onSubmit- Handles the submission of the login form
  onSubmit(loginForm: NgForm) {

    // Extract email and password from the form values
    const email = loginForm.value.email;
    const password = loginForm.value.password;

    // Make a POST request to Firebase API for login
    this.http
      .post<AuthResponseData>(
        `${FIREBASE_AUTH_BASEURL}/verifyPassword?key=${FIREBASE_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).subscribe({
        next: resData => {

          // Handle successful login
          console.log('login response data', resData);
          localStorage.setItem('userData', JSON.stringify(resData));

          // Display a success notification
          this.snackBar.open('Login successful! Welcome back!', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          // Navigate to the account page
          this.router.navigate(['/account']);
        },
        error: (errorRes) => {

          // Handle login errors
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
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              this.errorMessage = 'An unusual activity has been detected from this device. Please try again later.';
              break;

            case 'INVALID_LOGIN_CREDENTIALS':
              this.errorMessage = 'Invalid login credentials. Please check your email id and password and try again.';
              break;
          }
        }
      })

  }

  
  // Navigates to the registration page when the "Switch to Register" button is clicked.

  onClickRegister() {
    this.router.navigate(['/register'])
  }
}
