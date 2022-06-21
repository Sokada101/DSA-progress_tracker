import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AngularMaterialModule} from '../angular-material.module';

import {LoginComponent} from './login/login.component';
import {DemoLoginComponent} from './demologin/demologin.component';
import {SignupComponent} from './signup/signup.component';

import {AuthRoutingModule} from './auth-routing';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    DemoLoginComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    AuthRoutingModule,
  ]
})
export class AuthModule {
}
