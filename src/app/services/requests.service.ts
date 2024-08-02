import { inject, Injectable } from '@angular/core';
import {
  calculateLeaveDays,
  Employee,
  LeaveRecord,
} from '../models/dashboard.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { first, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private firestore = inject(AngularFirestore);
  private updatedLeaveRecords!: LeaveRecord[];

  answerRequest(
    employee: Employee,
    updatedData: {
      leaveId: number;
      approver_description: string;
      answer: boolean;
    }
  ) {
    const updatedLeaves = employee.leaveRecords.map((record) => {
      if (record.id === updatedData.leaveId) {
        const name = localStorage.getItem('theNameOfEmployeeLoggedIn');
        return {
          ...record,
          leaveStatus: updatedData.answer ? 'approved' : 'rejected',
          approver: name,
          approver_description: updatedData.approver_description,
        };
      }
      return record;
    });

    const updatedEmployee = { ...employee, leaveRecords: updatedLeaves };

    return this.firestore
      .collection('employees')
      .doc(employee.id.toString())
      .update(updatedEmployee);
  }

  allLeaveRecords(): Observable<LeaveRecord[]> {
    const uid = localStorage.getItem('theIdOfEmployeeWhoIsLoggedIn')!;
    return this.firestore
      .collection('employees')
      .doc<Employee>(uid)
      .valueChanges()
      .pipe(
        map((doc) => doc?.leaveRecords ?? []) // Wrap the document in an array or return an empty array if undefined
      );
  }

  addRequest(request: any, isHalfDay?: boolean) {
    let requestToAdd: LeaveRecord;

    if (isHalfDay) {
      requestToAdd = {
        id: Math.random() * 20,
        leaveDays: '0.5',
        leaveDateFrom: Timestamp.fromDate(request.leaveDate),
        leaveDateTo: Timestamp.fromDate(request.leaveDate),
        leaveStatus: 'pending',
        approver: '',
        approver_description: '',
        requestDate: Timestamp.fromDate(new Date()),
        description: request.description,
        leaveType: request.leaveType,
        halfDay: isHalfDay,
        AM_PM: request.AM_PM,
      };
    } else {
      requestToAdd = {
        ...request,
        id: Math.random() * 20,
        leaveDays: calculateLeaveDays(
          Timestamp.fromDate(request.leaveDateFrom),
          Timestamp.fromDate(request.leaveDateTo)
        ).toString(),
        leaveDateFrom: Timestamp.fromDate(request.leaveDateFrom),
        leaveDateTo: Timestamp.fromDate(request.leaveDateTo),
        leaveStatus: 'pending',
        approver: '',
        approver_description: '',
        requestDate: Timestamp.fromDate(new Date()),
        halfDay: isHalfDay,
      };
    }
    const uid = localStorage.getItem('theIdOfEmployeeWhoIsLoggedIn')!;

    //get all stored leave records to update the field of leaveRecords in firestore
    this.allLeaveRecords()
      .pipe(first())
      .subscribe((data) => {
        this.updatedLeaveRecords = [...data, requestToAdd];

        this.firestore
          .collection('employees')
          .doc(uid)
          .update({ leaveRecords: this.updatedLeaveRecords })
          .then(() => {
            console.log('Leave records updated successfully');
          })
          .catch((error) => {
            console.error('Error updating leave records: ', error);
          });
      });
  }

  cancelLeave(leaveId: number) {
    const uid = localStorage.getItem('theIdOfEmployeeWhoIsLoggedIn')!;
    this.allLeaveRecords()
      .pipe(first())
      .subscribe((data) => {
        this.updatedLeaveRecords = data.filter((leave) => leave.id !== leaveId);

        this.firestore
          .collection('employees')
          .doc(uid)
          .update({ leaveRecords: this.updatedLeaveRecords })
          .then(() => {
            console.log('Leave records updated successfully');
          })
          .catch((error) => {
            console.error('Error updating leave records: ', error);
          });
      });
  }
}
