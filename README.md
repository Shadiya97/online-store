Online Store Angular App

Welcome to the Online Store Angular app! This app is built using Angular CLI version 15.0.4 and incorporates essential features like a login page, registration page, and an account page. Below, you'll find a detailed guide on the functionalities and technologies used in this project.

Features:

Registration Page:
Users can register for an account by providing a new email ID and a password containing at least 6 characters.

Login Page:
Registered users can log in by providing their email and password.
Successful login redirects users to the account page, which is protected by the CanActivate Auth Guard. Unauthorized users are redirected to the login page.

Account Page:
Users can update their profile display name.
Users can change their password.
Logout option is available.
If the password is changed, the user is required to log in again.

Backend - Firebase:
Firebase is used as the backend for this application.
Firebase Authentication REST API is utilized for user registration, sign-in, updating profile display names, and changing passwords.

Styling:
Styling is done using Bootstrap and Angular Material.

Snackbar Notifications:
Angular Material Snackbars are used to display messages upon success or error in API requests.
Error handling is implemented for each API request, providing informative messages (e.g., attempting to register with an existing email).

Routing:
Angular routing is employed to navigate between different pages.

Model Files:
model.ts files are present in the app to define the types of API responses in Firebase requests.

Prerequisites
Node.js and npm installed.
Angular CLI version 15.0.4 globally installed.

Getting Started
Clone the repository.
Run npm install to install dependencies.
Run ng serve to start the development server.
Navigate to http://localhost:4200/ in your browser.
Feel free to explore the codebase and customize the app according to your needs!

License
This project is licensed under the MIT License. Feel free to use, modify, and distribute the code as per the license terms. If you encounter any issues or have suggestions, please open an issue.
