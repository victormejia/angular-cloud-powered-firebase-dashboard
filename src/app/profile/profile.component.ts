import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from '../core/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<UserProfile>;
  item: Observable<UserProfile>;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) { }

  ngOnInit() {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.afAuth.auth.currentUser.uid}`);
    this.item = this.itemDoc.valueChanges();
  }

}
