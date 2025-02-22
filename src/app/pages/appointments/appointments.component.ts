import {Component, OnInit} from '@angular/core';
import {AppointmentService} from '../../services/appointment.service';
import {NgForOf, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-appointments',
  imports: [
    NgIf,
    NgForOf,
    RouterOutlet
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit{
  appointments: any[] = [];
  patientId: number | null = null;

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.appointmentService.getCurrentUser().subscribe((data: any) => {
      this.patientId = data.id;
      this.loadAppointments()
    });
  }

  loadAppointments() {
    if(this.patientId !== null) {
      this.appointmentService.getPatientAppointments(this.patientId).subscribe((data: any) => this.appointments = data);
    }
  }

  cancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe(() => {
      alert('Appointment cancelled successfully');
      this.loadAppointments();
    });
  }

}
