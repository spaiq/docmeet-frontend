import {Component, OnInit} from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';

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
  specialities: any[] = [];
  appointments: any[] = [];
  selectedSpeciality: number | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.appointmentService.getSpecialities().subscribe((data: any) => {
      this.specialities = data;
    });
  }

  searchAppointments() {
    if (this.selectedSpeciality) {
      this.appointmentService.getAvailableAppointments(this.selectedSpeciality, 0, 10).subscribe((data: any) => {
        this.appointments = data;
      });
    }

  }

  bookAppointment(appointmentId: number) {
    this.appointmentService.bookAppointment(appointmentId).subscribe(() => {
      alert('Appointment booked successfully');
      this.searchAppointments();
    });
  }

}
