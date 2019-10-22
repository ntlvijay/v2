import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Skills } from '../../services/skill.model';
import { SkillsService } from '../../services/skills.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../services/must-match.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
;
dropdownList = [];
skills: Skills[] = [];
skillssub: Subscription;
user_skills = [];
dropdownSettings = {};
registerForm: FormGroup;
  submitted = false;
  name: String;
  username: String;
  password: String;
  email: String;
  confirmPassword: String;
  emailRegex = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@prodapt([\.])com/;
  selectedItems:any =[];
  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private skillService: SkillsService,
  ) { }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      skills: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@prodapt([\.])com')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
  }, {
      validator: MustMatch('password', 'confirmPassword')
  });

  this.skillService.getSkills();


  this.skillssub = this.skillService.getPostUpdateListener()
    .subscribe((skills: Skills[]) => {
      this.skills = skills;
      console.log(skills);
      let tmp=[];
      for(let i=0; i < skills.length; i++) {
        tmp.push({ item_id: i, item_text: skills[i].skill_name });
      }
      this.dropdownList = tmp;
      console.log(this.dropdownList);

  // this.selectedItems=[{item_id : 0,item_text:'Angular'},
  // {item_id : 1,item_text:'Python'}]


    });

  // this.dropdownList = [
  //   { item_id: 1, item_text: 'Java' },
  //   { item_id: 2, item_text: 'Python' },
  //   { item_id: 3, item_text: 'Angular' },
  //   { item_id: 4, item_text: '.NET' },
  //   { item_id: 5, item_text: 'React' }
  // ];

  this.dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  }


  onItemSelect(item: any) {
    console.log('Select',item);
     this.user_skills.push(item.item_text);
     console.log('Select',this.user_skills);
     
   }
 
   onItemDeSelect(item:any)
   {
     console.log('Testing Deselect');
     console.log('Deselect',item);
     var index = this.user_skills.indexOf(item.item_text);
     console.log('Index',index);
     this.user_skills.splice(index,1);
     console.log('DeSelect',this.user_skills);
 
   }
 
   onSelectAll(items: any) {
     this.user_skills = [];
     for(var i=0;i<items.length;i++){
       this.user_skills.push(items[i].item_text);
     }
     console.log('onSelectAll',this.user_skills);
     console.log('onSelectAll',items);
   }
   onItemDeSelectAll(items:any){
     this.user_skills = [];
   }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

  submitRegisterForm() {

    this.submitted = true;
    console.log(this.user_skills);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    const user = {
      name: this.name,
      username: this.username,
      password: this.password,
      email: this.email,
      skills: this.user_skills

    }

    // Validate required fields
    for (let key in user) {
      if (!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500  });
      return false;
      }
    }
    // Validate Email
    if (!this.validateService.validateEmail(this.email)) {
      this.flashMessagesService.show('Enter a valid Prodapt Mail ID', { cssClass: 'alert-danger', timeout: 1500 });
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/login']);
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          this.router.navigate(['/register']);
        }
      },
      err => {
        this.authService.handleError(err);
      });
  }

}
