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
  pageSize: number = 5;
  currentPage: number = 0;
  totalPages: number = 1;

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.appointmentService.getCurrentUser().subscribe((data: any) => {
      this.patientId = data.id;
      this.loadAppointments()
    });
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

  loadAppointments() {
    if(this.patientId !== null) {
      this.appointmentService.getPatientAppointments(this.patientId, this.currentPage, this.pageSize).subscribe(async (data: any) => {
        this.totalPages = data.totalPages;
        this.appointments = await Promise.all(data.content.map(async (app: any) => {
          const doctor = await this.appointmentService.getDoctor(app.doctorId).toPromise();
          const doctorName = await this.appointmentService.getDoctorName(doctor.id).toPromise();
          return {...app, doctorName};
        }));
      });
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAppointments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAppointments();
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadAppointments();
  }

  confirmCancel(appointmentId: number) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.cancelAppointment(appointmentId);
    }
  }

  cancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe(() => {
      alert('Appointment cancelled successfully');
      this.loadAppointments();
    });
  }

}
