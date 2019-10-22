import { Component, OnInit ,Injectable} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';
import { AuthService } from '../../services/auth.service';
import { MainService } from '../../services/main.service';


@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
@Injectable()
export class AddVideoComponent implements OnInit {

  subtopic: String;
  topic: String;
  playlists: any;
  serverAddress: String;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private LearnService: LearnService,
    private authService: AuthService,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.serverAddress = this.mainService.getServerAddress();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.subtopic = params['subtopic'];
      this.topic = params['topic'];

      const playlist = {
        topic: this.topic,
        subtopic: this.subtopic,
      }

      this.LearnService.getPlaylistBySubtopic(playlist).subscribe(
        data => {
          this.playlists = data;
        },
        err => {
          this.LearnService.handleError(err);
      });
    });
  }

  addPlaylist() {
    this.router.navigate(['/addPlaylist'], { queryParams: { topic: this.topic, subtopic: this.subtopic }});
  }

}
