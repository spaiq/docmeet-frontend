import { Component } from '@angular/core';
import {CalendarComponent} from "../../components/calendar/calendar.component";
import {NgOptimizedImage} from "@angular/common";
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [
    CalendarComponent,
    RouterOutlet
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  protected readonly window = window;
}
