import {Component, inject, OnInit} from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {NgbCalendar, NgbDate, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  calendar = inject(NgbCalendar);

  specialities: any[] = [];
  appointments: any[] = [];
  selectedSpeciality: number | null = null;
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 1;
  fromDate: string | undefined;
  toDate: string | undefined;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.appointmentService.getSpecialities().subscribe((data: any) => {
      this.specialities = data;
    });

    this.setDefaultDates();
  }

  getSpecialityFromUrl() {
    const params = new URLSearchParams(window.location.search);

    return params.get('speciality');
  }

  setDefaultDates() {
    let now = new Date();
    console.log(now);
    console.log(now.getMinutes());
    console.log(now.getHours() + 2);

    if (now.getMinutes() >= 50) {
      now.setHours(now.getHours() + 3);
    } else {
      now.setHours(now.getHours() + 2);
    }
    now.setMinutes(0);
    this.fromDate = now.toISOString().slice(0, 16);

    let toDate = new Date(now);
    toDate.setHours(now.getHours() + 24*7);
    this.toDate = toDate.toISOString().slice(0, 16);
  }

  searchAppointments() {
    if (this.selectedSpeciality) {
      this.appointmentService.getAvailableAppointments(this.selectedSpeciality, this.currentPage, this.pageSize, this.fromDate, this.toDate).subscribe(async (data: any) => {
        this.totalPages = data.totalPages;
        this.appointments = await Promise.all(data.content.map(async (app: any) => {
          const doctor = await this.appointmentService.getDoctor(app.doctorId).toPromise();
          const doctorName = await this.appointmentService.getDoctorName(doctor.id).toPromise();
          return {...app, doctorName};
        }));
      });
    }
  }

  formatDate(dateTime: string): string {
    const date = new Date(dateTime.replace('T', ' '));
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.searchAppointments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.searchAppointments();
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.searchAppointments();
  }

  bookAppointment(appointmentId: number) {
    this.appointmentService.bookAppointment(appointmentId).subscribe(() => {
      alert('Appointment booked successfully');
      this.searchAppointments();
    });
  }

}
