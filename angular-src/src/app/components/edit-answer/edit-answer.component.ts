import { Component, OnInit } from '@angular/core';
import { DiscussService } from '../../services/discuss.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Skills } from '../../services/skill.model';
import { SkillsService } from '../../services/skills.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-edit-answer',
  templateUrl: './edit-answer.component.html',
  styleUrls: ['./edit-answer.component.css']
})
export class EditAnswerComponent implements OnInit {
  questionId: String;
  answerId: String;
  initialBody: String;
  body: String;
  question: any = [];
  deleteBtnText: String;
  initialBodyAvailable: Boolean
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
  newQuestion: String;
  tags: String[] = [];
  tag: string;
  title: string;
  initialQuestion: String;

  username: String;
  constructor(
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.deleteBtnText = "Delete Answer";
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.answerId = params['id'];

      const answer = {
        id: this.answerId,
      }

      this.discussService.getAnswerById(answer).subscribe(
        data => {
          console.log(data);
          this.initialBody = data.body;
          this.initialBodyAvailable = true;
          this.questionId = data.questionId;

          const question = {
            id: this.questionId,
          }
          this.discussService.getQuestionById(question).subscribe(
            data => {
              this.question = data;
            },
            err => {
              this.discussService.handleError(err);
            });
        },
        err => {
          this.discussService.handleError(err);
      });

    });
  }

  tinyResponce(tinyBody: String) {
    this.body = tinyBody;
  }

  editAnswer() {
    if (!this.body) {
      this.flashMessagesService.show(`The answer cannot be blank.`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const question = {
      title: this.title,
      id: this.questionId,
      question: this.newQuestion,
      tags: this.user_skills,
      username: this.username,
    }
    const answer = {
      id: this.answerId,
      body: this.body,
      username: JSON.parse(localStorage.getItem('user')).username,
    }

    this.discussService.editAnswer(answer).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/question', question.id ]);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.discussService.handleError(err);
    });
  }

  deleteAnswer() {
    if (this.deleteBtnText === "Delete Answer") {
      this.deleteBtnText = "Click again to confirm";
      return false;
    }
    const answer = {
      id: this.answerId,
      username: JSON.parse(localStorage.getItem('user')).username,
    }

    this.discussService.deleteAnswer(answer).subscribe(
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
