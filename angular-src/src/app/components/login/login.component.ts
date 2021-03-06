import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username: String;
  password: String;
  destinationUrl: String;
  loginForm: FormGroup;
  submitted = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.destinationUrl = params['url'];
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
  });
  }
   // convenience getter for easy access to form fields
   get f() { return this.loginForm.controls; }
  submitLoginForm() {

    this.submitted = true;

    let user = {
      username: this.username,
      password: this.password,
    }

    for(let key in user) {
      if(!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
      }
    }

    this.authService.authenticateUser(user).subscribe(
      data  => {
        if (data.success) {
          this.authService.storeUserInfo(data.token, data.user);
          localStorage.setItem('login', 'true');
          AuthService.userRole = data.role;

          if (this.destinationUrl) {
            this.router.navigate([this.destinationUrl],{ queryParams: { login: true } });
          } else {
            this.router.navigate(['/dashboard'], { queryParams: { login: true } });
          }

        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          this.router.navigate(['/login']);
          return false;
        }
      },
      err => {
        this.authService.handleError(err);
    });
  }
}
