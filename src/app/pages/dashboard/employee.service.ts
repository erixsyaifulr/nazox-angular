import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
 
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 
  constructor(
    private http: HttpClient
  ) { }
 
  getEmployees(data): Observable<Employee[]> {
    return this.http.post<Employee[]>('api/employees', data);
  }
 
  getsearch(data): Observable<Employee[]> {
    return this.http.post<Employee[]>('api/employees_search', data);
  }
 
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('api/employee', employee);
  }
 
  getEmployee(id: number): Observable<any> {
    return this.http.get(`api/employee/${id}`);
  }
 
  updateEmployee(id: number, value: any): Observable<object> {
    return this.http.put(`api/employee/${id}`, value);
  }
 
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`api/employee/${id}`, { responseType: 'text' });
  }
}