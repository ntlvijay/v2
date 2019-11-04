import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.authService.getRoleFromServer().subscribe(
        data => {
          AuthService.userRole = data.role;
        },
        err => {
          this.authService.handleError(err);
      });
    }
  }


  onActivate(event) {
    window.scroll(0, 0);
    // or document.body.scrollTop = 0;
}
}
