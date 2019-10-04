import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserProfile } from '../core/user-profile.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<UserProfile>;
  users: Observable<UserProfile[]>;

  constructor(private afs: AngularFirestore) { 
    this.usersCollection = afs.collection<UserProfile>('users');
    this.users = this.usersCollection.valueChanges();
  }

  ngOnInit() {
  }

}
