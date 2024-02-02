import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  userData:any;
  editMode=false;
  
  constructor(private router:Router, private http:HttpClient, private snackBar: MatSnackBar){}

  ngOnInit(){
     this.userData=JSON.parse(localStorage.getItem('userData'))
  }

  onSubmit(pwChangeForm:NgForm){
    const newPassword= pwChangeForm.value.newPassword
    
    this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCec6Mdk8jfmnS3w0z74p2LmQ7pSNT9o5Y',
    {
      idToken: this.userData?.idToken,
      password:newPassword,
      returnSecureToken:true

    }).subscribe((res)=>{

      this.snackBar.open('Password change successful! Please log in again.', 'Close', {
        duration: 5000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      this.onLogout()
    },(errorRes)=>{
      console.log(errorRes);
      this.snackBar.open('An unknown error occurred! Password change failed.', 'Close', {
        duration: 3000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
    )
  }


  onLogout(){
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
