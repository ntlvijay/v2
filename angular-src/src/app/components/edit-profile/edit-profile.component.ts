import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from 'app/services/main.service';
import { Skills } from '../../services/skill.model';
import { SkillsService } from '../../services/skills.service';
import { Subscription } from 'rxjs';
import { IDropdownSettings} from 'ng-multiselect-dropdown';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username: String;
  user: any = [];
  user_skills_Copy :any = [];
  uploadImg: Boolean;
  serverAddress: String;
  skills : Skills[] = [];
  skillssub: Subscription;
  user_skills = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  Notification :Boolean;


  constructor(
    private router: Router,
    private authService: AuthService,
    private blogService:  BlogService,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private mainService:MainService,
    private skillService:SkillsService,

  ) {

      this.serverAddress = mainService.getServerAddress();


  }

  ngOnInit() {


    this.skillService.getSkills();


    this.skillssub = this.skillService.getPostUpdateListener()
      .subscribe((skills: Skills[]) => {
        this.skills = skills;
        let tmp=[];
        for(let i=0; i < skills.length; i++) {
          tmp.push({ item_id: i, item_text: skills[i].skill_name });
        }
        this.dropdownList = tmp;
        console.log(this.dropdownList);

    // this.selectedItems=[{item_id : 0,item_text:'Angular'},
    // {item_id : 1,item_text:'Python'}]


      });
      // for(let i =0;i<this.user.skills.length;i++){
      //       console.log(this.user[i].skills);
      // }
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.username = params['username'];
        const user = {
          username: this.username,
        }
        this.authService.authProfile(user).subscribe(
          data => {
            this.user = data;
           // console.log(this.user);
           // console.log(data.username);
            //console.log(this.user.skills);
           this.user_skills = this.user.skills;
            let tmp = [];
            for(let i =0 ; i < this.dropdownList.length;i++){
              if(this.user.skills.includes(this.dropdownList[i].item_text)){
                tmp.push({item_id : this.dropdownList[i].item_id,
                  item_text: this.dropdownList[i].item_text});
              }
            }
            this.selectedItems = tmp;
          },
          err => {
            this.authService.handleError(err);
        });
      });



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
    console.log(this.user.username);
   console.log(this.selectedItems);
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

  uploadImgFunc() {
    this.uploadImg = true;
  }

  submitForm() {
    //this.user.skills = this.user.skills.concat(this.user_skills);
    this.user.skills = this.user_skills;
    if (!this.user.name || !this.user.email) {
      this.flashMessagesService.show(`Please fill all inputs marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
    }
    this.authService.updateProfile(this.user).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/users', this.username]);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            return false;
        }
      },
      err => {
        this.authService.handleError(err);
      });
  }

  cancelForm(){
    this.router.navigate(['/users', this.username]);
  }
}