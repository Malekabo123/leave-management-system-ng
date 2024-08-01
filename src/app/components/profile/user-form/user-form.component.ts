import {
  Component,
  inject,
  Input,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { Employee, LANGUAGES } from '../../../models/dashboard.model';
import { Timestamp } from '@angular/fire/firestore';
import { FocusInvalidInputDirective } from '../../../directives/focus-invalid.directive';
import { EmployeesService } from '../../../services/employeesService.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  private employeesService = inject(EmployeesService);
  @Input() userInfo!: Employee;
  languages = LANGUAGES;
  file = '';
  isUploading = false;

  private router = inject(Router);
  private storage = inject(AngularFireStorage);

  @ViewChildren(NgControl) formControls!: QueryList<NgControl>;
  @ViewChild(FocusInvalidInputDirective)
  invalidInputDirective!: FocusInvalidInputDirective;

  form = new FormGroup({
    image: new FormControl(''),
    companyEmail: new FormControl(
      { value: '', disabled: true },
      {
        validators: [Validators.email, Validators.required],
      }
    ),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
    personalEmail: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
    }),
    maritalStatus: new FormControl('', {
      validators: [Validators.required],
    }),
    birthDate: new FormControl(new Date(), {
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      validators: [Validators.required],
    }),
    languagesSpoken: new FormControl([''], {
      validators: [Validators.required],
    }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userInfo'] && this.userInfo) {
      this.updateForm();
    }
  }

  private updateForm(): void {
    this.form.patchValue({
      image: this.userInfo.personalInformation.image,
      companyEmail: this.userInfo.credentials.company_Email,
      password: this.userInfo.credentials.password,
      personalEmail: this.userInfo.contactInfo.personal_Email,
      phone: this.userInfo.contactInfo.phone_Number,
      maritalStatus:
        this.userInfo.personalInformation.marital_Status.toLowerCase(),
      birthDate: this.userInfo.personalInformation.date_Of_Birth.toDate(),
      address: this.userInfo.personalInformation.address,
      languagesSpoken: this.userInfo.personalInformation.languages_Spoken.map(
        (a: string) => a.toLowerCase()
      ),
    });
  }

  onSubmit() {
    this.invalidInputDirective.check(this.formControls);
    const {
      password,
      personalEmail,
      phone,
      maritalStatus,
      birthDate,
      address,
      languagesSpoken,
      image,
    } = this.form.value;

    const updatedUserInfo: Employee = {
      ...this.userInfo,
      credentials: {
        ...this.userInfo.credentials,
        password: password!,
        repeat_password: password!,
      },
      contactInfo: {
        ...this.userInfo.contactInfo,
        personal_Email: personalEmail!,
        phone_Number: phone!,
      },
      personalInformation: {
        ...this.userInfo.personalInformation,
        marital_Status: maritalStatus!,
        date_Of_Birth: Timestamp.fromDate(birthDate!),
        address: address!,
        languages_Spoken: languagesSpoken!,
        image: image!,
      },
    };

    this.employeesService.editProfileInfo(updatedUserInfo);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const myFile = files[0];
      const filePath = `profileImages/${this.userInfo.id}/${myFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, myFile);
      this.isUploading = true;

      // List all images in the folder
      const folderRef = this.storage.ref(`profileImages/${this.userInfo.id}`);
      folderRef.listAll().subscribe(
        (listResult) => {
          // Delete each image in the folder
          const deletePromises = listResult.items.map((itemRef) =>
            itemRef.delete()
          );

          // Wait for all delete operations to complete
          Promise.all(deletePromises)
            .then(() => {
              // Upload the new image
              task
                .snapshotChanges()
                .pipe(
                  finalize(() => {
                    fileRef.getDownloadURL().subscribe((url) => {
                      this.userInfo.personalInformation.image = url;
                      this.form.controls['image'].setValue(url);
                      this.employeesService.editProfilePhoto(
                        this.userInfo.id.toString(),
                        url
                      );
                      this.isUploading = false;
                    });
                  })
                )
                .subscribe();
            })
            .catch((error) => {
              console.error('Error deleting old images:', error);
              this.isUploading = false;
            });
        },
        (error) => {
          console.error('Error listing files:', error);
          this.isUploading = false;
        }
      );
    }
  }

  getFileURL() {
    return this.userInfo.personalInformation.image;
  }

  resetInput() {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  logout() {
    localStorage.removeItem('theEmailYourAdminGivesYou');
    localStorage.removeItem('theIdOfEmployeeWhoIsLoggedIn');
    localStorage.removeItem('theNameOfEmployeeLoggedIn');
    localStorage.removeItem('yourRoleInThisCompany');
    this.router.navigate(['/login']);
  }
}
