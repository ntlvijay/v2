import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DiscussService } from '../../services/discuss.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Skills } from '../../services/skill.model';
import { SkillsService } from '../../services/skills.service';
import { Subscription } from 'rxjs';
declare var jQuery: any;
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  editable: Boolean;
  question: any = [];
  answerList: any = [];
  questionId: String;
  username: String;
  body: String;
  skills: Skills[] = [];
  skillssub: Subscription;
  user_skills = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussService: DiscussService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {

    if (this.authService.loggedIn()) {
      this.username = JSON.parse(localStorage.getItem('user')).username;
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.questionId = params['id'];

      const question = {
        id: this.questionId,
      }

      this.discussService.getQuestionById(question).subscribe(
        data => {
          this.question = data;
          const user = {
            username: this.question.username,
          };
          if (this.authService.loggedIn()) {
            this.authService.checkUsername(user).subscribe(
              data => {
                if (data.authentication) {
                  this.editable = true;
                }
              },
              err => {
                this.authService.handleError(err);
            });
          }
        },
        err => {
          this.discussService.handleError(err);
        });

        this.discussService.getAnswerByQuestion(question).subscribe(
          data => {
            this.answerList = data;
          },
          err => {
            this.discussService.handleError(err);

          });
    });
  }

  writeAnswerFunc() {
    this.router.navigate(['/writeAnswer', this.questionId]);
  }

  editAnswer(answer) {
    this.router.navigate(['/editAnswer'], { queryParams: { id: answer._id }});
  }

  tinyResponse(tinyBody: String) {
    this.body = tinyBody;
  }

  submitAnswer() {
    jQuery('#AnswerModal').modal('hide');
    if (!this.body) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }

    const answer = {
      username: JSON.parse(localStorage.getItem('user')).username,
      body: this.body,
      questionId: this.questionId,
      notificationFor: this.question.username,
      notificationLink: `/question/${ this.questionId }`,
      notificationMessage: `${ this.question.username } answered your question`,
    }
    this.answerList.unshift(answer);
    this.discussService.addAnswer(answer).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.discussService.handleError(err);
      });
  }


}
