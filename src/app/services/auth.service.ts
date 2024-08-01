import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firestore = inject(AngularFirestore);

  authorizedEmployee(email: string, password: string): Observable<Employee[]> {
    const isAuthorized = this.firestore
      .collection<Employee>('employees', (ref) =>
        ref
          .where('credentials.company_Email', '==', email)
          .where('credentials.password', '==', password)
      )
      .valueChanges();

    return isAuthorized;
  }
}
