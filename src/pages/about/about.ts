import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ParamProvider } from '../../providers/param/param';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  device;
  color;
  estado;
  poolData = {
    UserPoolId: "us-east-1_GJTP4ImyO",
    ClientId: "1o5oqra3k14tm1ugco03vhn0ug"
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public paramProvider: ParamProvider,
    public cognitoProvider: CognitoServiceProvider,
    public app: App) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
    setInterval(() => {
      if (this.paramProvider.estado == 'Desconectado') {
        this.color = this.paramProvider.color;
        this.estado = this.paramProvider.estado;
      }
    }, 1000);
  }

  signOut() {
    this.cognitoProvider.signOut().then(
      res => {
        console.log(res)
        this.app.getRootNav().popToRoot(LoginPage);
      }, err => {
        console.log(err);
      }
    );
  }
}
