import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: Object;
  videoUrl: String;
  sourcesList: any = [];
  teamList: any = [];


  constructor(
    private router: Router,
    private authService: AuthService,
    // tslint:disable-next-line: no-shadowed-variable
    private LearnService: LearnService,
  ) {
    this.videoUrl = '/assets/videos/introVideo.mp4';
   }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.LearnService.getAllSources().subscribe(
      data => {
        this.sourcesList = data;
      },
      err => {
        this.LearnService.handleError(err);
      }
    );
    this.authService.getTeam().subscribe(
      data => {
        this.teamList = data;
      },
      err => {
        this.authService.handleError(err);
      }
    );
  }

}
