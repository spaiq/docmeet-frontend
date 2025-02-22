import { Component, OnInit } from '@angular/core';
import {CalendarService} from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.calendarService.renderCalendar();
  }

  onPrevClick() {
    this.calendarService.changeMonth('prev');
  }

  onNextClick() {
    this.calendarService.changeMonth('next');
  }
}
