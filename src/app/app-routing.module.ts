import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, customClaims } from '@angular/fire/auth-guard';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { UsersComponent } from './users/users.component';
import { pipe } from 'rxjs';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToProfile = () => 
  map(user => user ? ['profile', (user as any).uid]: true);

const onlyAllowSelf = next => 
  map(
    user => (!!user && next.params.id == (user as any).uid) || ['']
  );

const adminOnly = () => pipe(
  customClaims,
  map(claims => claims.admin === true || [''])
);

const redirectLoggedInToProfileOrUsers = () => 
  pipe(
    customClaims,
    map(claims => {
      // if no claims, then there is no authenticated user
      // so alow the route ['']
      if (claims.length === 0) {
        return true;
      }

      // if a custom claim set, then redirect to ['users']
      if (claims.admin) {
        return ['users'];
      }

      // otherwise, redirect user's profile page
      return ['profile', claims.user_id]
    })
  )
const allowOnlySelfOrAdmin = (next) => 
    pipe(
      customClaims,
      map(claims => {
        if (claims.length = 0) {
          return ['']
        }

        return next.params.id === claims.user_id || claims.admin;
      })
    )
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToProfileOrUsers }
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: allowOnlySelfOrAdmin }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
