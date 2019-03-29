import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { DataPage } from '../pages/data/data';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BLE } from '@ionic-native/ble';
import { ParamProvider } from '../providers/param/param';
import { CognitoServiceProvider } from '../providers/cognito-service/cognito-service';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from '@angular/common/http';
import { SignupPage } from '../pages/signup/signup';
import { MatchPasswordProvider } from '../providers/match-password/match-password';
import { AboutPage } from '../pages/about/about';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';

@NgModule({
  declarations: [
    MyApp,
    BluetoothPage,
    DataPage,
    LoginPage,
    SignupPage,
    AboutPage,
    ForgotpasswordPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BluetoothPage,
    DataPage,
    LoginPage,
    SignupPage,
    AboutPage,
    ForgotpasswordPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ParamProvider,
    CognitoServiceProvider,
    MatchPasswordProvider
  ]
})
export class AppModule { }
