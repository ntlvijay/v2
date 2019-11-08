import { Component, OnInit } from '@angular/core';
import { DiscussService } from '../../services/discuss.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Skills } from '../../services/skill.model';
import { SkillsService } from '../../services/skills.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  question: String;
  tags: String[] = [];
  tag: string;
  title: string;
  skills : Skills[] = [];
  skillssub: Subscription;
  user_skills = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  constructor(
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private skillService:SkillsService
  ) { }

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

      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        enableCheckAll: false,
        itemsShowLimit: 3,
        allowSearchFilter: false
      };
  }

  onItemSelect(item: any) {
    console.log('Select', item);
     this.user_skills.push(item.item_text);
     console.log('Select', this.user_skills);
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
 
  //  onSelectAll(items: any) {
  //    this.user_skills = [];
  //    for(var i=0;i<items.length;i++){
  //      this.user_skills.push(items[i].item_text);
  //    }
  //    console.log('onSelectAll',this.user_skills);
  //    console.log('onSelectAll',items);
  //  }
  //  onItemDeSelectAll(items:any){
  //    this.user_skills = [];
  //  }

  tinyResponse(tinyBody: String) {
    this.question = tinyBody;
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

  submitQuestion() {
    if (!this.question || !this.title) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const question = {
      question: this.question,
      title: this.title,
      tags: this.user_skills,
      username: JSON.parse(localStorage.getItem('user')).username,
    }
    this.discussService.addQuestion(question).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/discuss'], { queryParams: { pn: 0 }});
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          this.router.navigate(['/askQuestion']);
        }
      },
      err => {
        this.discussService.handleError(err);
      },
    );
  }
}
