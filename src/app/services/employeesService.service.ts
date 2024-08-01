import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/dashboard.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private firestore = inject(AngularFirestore);

  allEmployees(): Observable<Employee[]> {
    return this.firestore
      .collection<Employee>('employees', (ref) =>
        ref.where(
          'professionalInformation.supervisor_Company_Email',
          '==',
          localStorage.getItem('theEmailYourAdminGivesYou')
        )
      )
      .valueChanges();
  }

  colleagues(supervisorEmail: string): Observable<Employee[]> {
    return this.firestore
      .collection<Employee>('employees', (ref) =>
        ref.where(
          'professionalInformation.supervisor_Company_Email',
          '==',
          supervisorEmail
        )
      )
      .valueChanges();
  }

  editEmployeeInfo(updatedEmployee: Employee) {
    return this.firestore
      .collection('employees')
      .doc(updatedEmployee.id.toString())
      .update(updatedEmployee);
  }

  removeEmployee(id: string) {
    return this.firestore.collection('employees').doc(id).delete();
  }

  addEmployee(newEmployeeData: Employee) {
    const id = newEmployeeData.id;

    return this.firestore
      .collection('employees')
      .doc(id.toString())
      .set({
        ...newEmployeeData,
      });
  }

  myProfileInfo(): Observable<Employee[]> {
    return this.firestore
      .collection<Employee>('employees', (ref) =>
        ref.where(
          'credentials.company_Email',
          '==',
          localStorage.getItem('theEmailYourAdminGivesYou')
        )
      )
      .valueChanges();
  }

  editProfileInfo(updatedProfileInfo: Employee) {
    return this.firestore
      .collection('employees')
      .doc(updatedProfileInfo.id.toString())
      .update(updatedProfileInfo);
  }

  editProfilePhoto(employeeId: string, image: string) {
    return this.firestore
      .collection('employees')
      .doc(employeeId)
      .update({ 'personalInformation.image': image });
  }
}
