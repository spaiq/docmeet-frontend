import {Component, Renderer2} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CalendarComponent} from './components/calendar/calendar.component';
import {NgOptimizedImage} from '@angular/common';
import {AuthService} from './services/auth.service';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'docmeet-frontend';


  constructor(
    private renderer: Renderer2,
    private router: Router,
    public authService: AuthService
  ) {
  }

  async ngOnInit() {
    const loginButton = document.getElementById('loginBtn');

    if (loginButton) {
      this.renderer.listen(loginButton, 'click', () => {
        this.toggleLogin();
      });
    }

    if(!!this.authService.getToken() && !this.authService.isRefreshTokenTimerStarted()){
      this.authService.startRefreshTokenTimer();
    }

    if(await this.authService.handleAuthCallback()){
        window.location.hash = ''; // Clear the URL fragment
        await this.router.navigate(['/']); // Navigate to a default route
        this.updateButtonText('Logout');
    } else if(loginButton){
      this.updateButtonText(this.authService.isAuthenticated() ? 'Logout' : 'Login');
    }
  }


    toggleLogin() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.updateButtonText('Login');
    } else {
      this.authService.login();
      this.updateButtonText('Logout');
    }
  }

  updateButtonText(text: string) {
    const loginButton = document.getElementById('loginBtn');
    if (loginButton) {
      this.renderer.setProperty(loginButton, 'innerText', text);
    }

  }

}
