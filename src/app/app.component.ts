import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'grid-dashboard';

  constructor(public auth: AuthService) {}

  ngOnInit() {
    particlesJS.load('particles', 'assets/particles.json', () => {
      console.log('callback - particles.js config loaded');
    });
  }

  logout() {
    this.auth.logout();
  }
}
