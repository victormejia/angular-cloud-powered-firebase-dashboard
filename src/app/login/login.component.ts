import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm) {
    this.loading = true;
    const { email, password, firstName, lastName } = form.value;

    try {
      const resp = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      await resp.user.updateProfile({ displayName: `${firstName} ${lastName}`});
      form.reset();
    } catch (error) {
      console.log(error.message);
    }
    this.loading = false;
  }

}
