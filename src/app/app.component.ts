import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { CognitoServiceProvider } from '../providers/cognito-service/cognito-service';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public cognitoProvider: CognitoServiceProvider) {

    this.platform.ready().then(() => {
      this.cognitoProvider.getUser().then(
        res => {
          console.log('AppComponent Log1: ' + res);
          this.rootPage = TabsPage;
        }, err => {
          console.log(err);
          this.rootPage = LoginPage;
        }
      );
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
