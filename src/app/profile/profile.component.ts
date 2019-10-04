import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from '../core/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<UserProfile>;
  item: Observable<UserProfile>;
  uid: string;

  loading = false;
  error: string;

  downloadURL: Observable<string>;
  uploadProgress: Observable<number>;

  constructor(
    public afAuth: AngularFireAuth, 
    public afs: AngularFirestore, 
    private route: ActivatedRoute,
    private auth: AuthService,
    private afStorage: AngularFireStorage
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');

    this.downloadURL = this.afStorage
      .ref(`users/${this.uid}/profile-image`)
      .getDownloadURL();
  }

  ngOnInit() {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges();
  }

  async onSubmit(ngForm: NgForm) {
    this.loading = true;

    const { 
      email,
      name,
      address,
      city,
      state,
      zip,
      ip,
      phone,
      specialty
    } = ngForm.form.getRawValue();

    const userProfile: UserProfile = {
      uid: this.uid,
      email,
      name,
      address,
      city,
      state,
      zip,
      ip,
      phone,
      specialty
    };

    try {
      await this.auth.updateUserDocument(userProfile);
    } catch(error) {
      console.log(error.message);
      this.error = error.message;
    }

    this.loading = false;
  }

  fileChange(event) {
    this.downloadURL = null;
    this.error = null;

    // get the file
    const file = event.target.files[0];

    // create the file refrence
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);

    // upload and store the task
    const task = this.afStorage.upload(filePath, file);
    task.catch(error => this.error = error.message);

    // observer percentage changes
    this.uploadProgress = task.percentageChanges();

    // get notified when the download URL is avaialbe
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }

}
