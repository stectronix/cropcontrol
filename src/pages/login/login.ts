import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import { SignupPage } from '../signup/signup';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParamProvider } from '../../providers/param/param';
import { TabsPage } from '../tabs/tabs';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;
  forgot: boolean = true;
  cont: number = 0;
  private formLogin: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cognitoProvider: CognitoServiceProvider,
    public paramProvider: ParamProvider,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController) {

    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]/* ,Validators.pattern('') */]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    if (this.formLogin.valid) {
      this.paramProvider.presentLoading('Iniciando Sesión ...')
      this.cognitoProvider.authenticate(this.formLogin.value.username, this.formLogin.value.password).then(
        res => {
          this.cont = 0;
          console.log('LoginPage log1: ' + res);
          this.paramProvider.loadingDismiss();
          this.navCtrl.push(TabsPage);
        }, err => {
          console.log('LoginPage log2: ' + JSON.stringify(err));
          this.paramProvider.loadingDismiss();
          switch (err.code) {
            case 'NetworkError':
              this.paramProvider.showToast('Error de conexión, intente mas tarde');
              break;
            case 'UserNotFoundException':
              this.paramProvider.showToast('Usuario no existe');
              break;
            case 'NotAuthorizedException':
              this.paramProvider.showToast('Contraseña incorrecta');
              this.cont++;
              break;
            case 'UserNotConfirmedException':
              this.paramProvider.showToast('Usuario no confirmado');
              this.resendVerificationCode(this.formLogin.value.username);
              break;
            default:
              break;
          }
        }
      );
    }
    if (this.cont > 0) {
      this.forgot = false;
    }
  }

  promptVerificationCode(username) {
    let alert = this.alertCtrl.create({
      title: 'Introduzca código de verificación',
      inputs: [
        {
          name: 'verificationCode',
          placeholder: 'Código de verificación'
        }
      ],
      buttons: [
        {
          text: 'Verificar',
          handler: data => {
            console.log('LoginPage log3: ' + data);
            this.verifyUser(data.verificationCode, username);
          }
        }
      ]
    });

    alert.present();
  }

  resendVerificationCode(username) {
    this.cognitoProvider.resendVerificationCode(this.formLogin.value.username).then(
      res => {
        console.log('LoginPage log4: ' + res);
        this.promptVerificationCode(username);
      }, err => {
        console.log('LoginPage log5: ' + err);
        this.paramProvider.showToast(err);
      }
    );
  }

  verifyUser(verificationCode,username) {
    this.cognitoProvider.confirmUser(verificationCode, username).then(
      res => {
        console.log('LoginPage log6: ' + res);
        this.paramProvider.showToast('Verificación exitosa');
        this.login();
      }, err => {
        console.log('LoginPage log7: ' + err);
        this.paramProvider.showToast('No se pudo verificar, intente de nuevo');
      }
    );
  }

  goToSignUp() {
    this.navCtrl.push(SignupPage);
  }

  goToForgotPassword() {
    this.navCtrl.push(ForgotpasswordPage);
  }
}
