import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  emailEntered: Boolean;
  email: String;
  answer: String;
  securityQuestion: String;
  password: String;
  forgotForm: FormGroup;
  submitted = false;
  emailRegex = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@prodapt([\.])com/;
  constructor(
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private validateService: ValidateService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@prodapt([\.])com')]],
  });

    this.emailEntered = false;
  }

  get f() { return this.forgotForm.controls; }

  submitemailForm() {
    const user = {
      email: this.email,
    }
    this.submitted = true;
  
      // stop here if form is invalid
      if (this.forgotForm.invalid) {
          return;


  


    for (let key in user) {
      if (!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
      }
    }

    this.authService.authemail(user).subscribe(
      data => {
        if(data.success) {
          this.securityQuestion = data.securityQuestion;
          this.emailEntered = true;
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.authService.handleError(err);
      });
  }
}

  submitAnswerForm() {
    const user = {
      email: this.email,
      password: this.password,
      answer: this.answer,
    }

    for (let key in user) {
      if (!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
      }
    }

    this.authService.changePassword(user).subscribe(
      data => {
        if (data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/login']);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            this.router.navigate(['/forgotPassword']);
        }
      },
      err => {
        this.authService.handleError(err);
    });
  }
}
