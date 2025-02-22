import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = environment.apiHost + '/api/v1';

  constructor(private http: HttpClient) {
  }

  getSpecialities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/specialities`);
  }

  getAvailableAppointments(specialityId: number, page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointments/speciality/${specialityId}/available?page=${page}&size=${size}`);
  }

  bookAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointment/${appointmentId}/book`, {});
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/current`);
  }

  getPatientAppointments(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}/appointments`);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointment/${appointmentId}/cancel`, {});
  }
}
