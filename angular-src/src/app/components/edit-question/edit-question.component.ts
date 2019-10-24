import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DiscussService } from '../../services/discuss.service';
import { Skills } from '../../services/skill.model';
import { SkillsService } from '../../services/skills.service';
import { Subscription } from 'rxjs';
import { IDropdownSettings} from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {

  questionId: String;
  newQuestion: String;
  tags: String[] = [];
  tag: string;
  title: string;
  initialQuestion: String;
  deleteBtnText: String;
  username: String;
  initialQuestionAvailable: Boolean;
  user_skills_Copy :any = [];
  uploadImg: Boolean;
  serverAddress: String;
  skills: Skills[] = [];
  skillssub: Subscription;
  user_skills = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  Notification: Boolean;

  constructor(
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private skillService: SkillsService,
  ) { }

  ngOnInit() {
    this.deleteBtnText = 'Delete Question';
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.questionId = params['id'];

      const question = {
        id: this.questionId,
      }

      this.discussService.getQuestionById(question).subscribe(
        data => {
          this.initialQuestion = data.question;
          this.initialQuestionAvailable = true;
          this.title = data.title;
          this.tags = data.tags;
          this.username = data.username;
        }
      )
    });



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
    //  console.log(this.user.username);
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




  tinyResponse(tinyBody: String) {
    this.newQuestion = tinyBody;
  }

  addTag() {
    this.tags.push(this.tag);
    this.tag = '';
  }

  removeTag(tag) {
    for(let ii = 0; ii < this.tags.length; ii++) {
      if (this.tags[ii] === tag) {
        this.tags.splice(ii, 1);
        break;
      }
    }
  }

  editQuestion() {
    if (!this.newQuestion) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const question = {
      title: this.title,
      id: this.questionId,
      question: this.newQuestion,
      tags: this.user_skills,
      username: this.username,
    }

    this.discussService.editQuestion(question).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/discuss'], { queryParams: { pn: 0 }});
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.discussService.handleError(err);
      });
    }

    deleteQuestion() {
      if (this.deleteBtnText === "Delete Question") {
        this.deleteBtnText = "Click Again to Confirm";
        return false;
      }

      const question  = {
        id: this.questionId,
        username: this.username,
      }

      this.discussService.deleteQuestion(question).subscribe(
        data => {
          if(data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/discuss'], { queryParams: { pn: 0 }});
          } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          }
        },
        err => {
          this.discussService.handleError(err);
      });
    }

}
