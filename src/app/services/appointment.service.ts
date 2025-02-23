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

  getAvailableAppointments(specialityId: number, page: number, size: number, from?: string, to?: string): Observable<any> {
    let url = `${this.apiUrl}/appointments/speciality/${specialityId}/available?page=${page}&size=${size}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;

    return this.http.get(url);
  }

  bookAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointment/${appointmentId}/book`, {});
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/current`);
  }

  getPatientAppointments(patientId: number, page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}/appointments?page=${page}&size=${size}`);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointment/${appointmentId}/cancel`, {});
  }

  getDoctor(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getDoctorName(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${userId}/name`, { responseType: 'text' });
  }
}
