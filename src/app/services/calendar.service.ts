import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  date = new Date();
  currentYear = this.date.getFullYear();
  currentMonth = this.date.getMonth();
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  renderCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    // Generate days
    let liDayTag = '';

    // Generate days for the previous month (inactive)
    for (let i = firstDayOfMonth; i > 0; i--) {
      liDayTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    // Generate days for the current month
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday = i === this.date.getDate() &&
      this.currentMonth === new Date().getMonth() &&
      this.currentYear === new Date().getFullYear()
        ? 'class="active"'
        : '';

      const isPastDay = new Date(this.currentYear, this.currentMonth, i) < new Date()
        ? 'class="inactive"'
        : '';

      liDayTag += `<li ${isToday} ${isPastDay}>${i}</li>`;
    }

    // Generate days for the next month (inactive)
    for (let i = lastDayOfMonth; i < 6; i++) {
      liDayTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    const currentDateTitle = document.querySelector('.current-date');
    const daysTag = document.querySelector('.days');
    if (currentDateTitle && daysTag) {
      currentDateTitle.innerHTML = `${this.months[this.currentMonth]} ${this.currentYear}`;
      daysTag.innerHTML = liDayTag;
    }
  }

  changeMonth(direction: 'prev' | 'next') {
    this.currentMonth = direction === 'prev' ? this.currentMonth - 1 : this.currentMonth + 1;

    if (this.currentMonth < 0 || this.currentMonth > 11) {
      this.date = new Date(this.currentYear, this.currentMonth);
      this.currentYear = this.date.getFullYear();
      this.currentMonth = this.date.getMonth();
    } else {
      this.date = new Date();
    }

    this.renderCalendar();
  }
}
