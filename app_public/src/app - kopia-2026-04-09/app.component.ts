import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({ 
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  imports: [RouterOutlet, RouterLink, RouterLinkActive] // 
})
export class AppComponent {
  title = 'app_public';
}





