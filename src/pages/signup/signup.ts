import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchPasswordProvider } from '../../providers/match-password/match-password';
import * as CognitoAuth from "amazon-cognito-identity-js";
import { ParamProvider } from '../../providers/param/param';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  private formRegister: FormGroup;
  username: string;
  email: string;
  password: string;
  verificationCode;
  userAttribute = [];
  success: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cognitoProvider: CognitoServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public paramProvider: ParamProvider) {

    this.formRegister = formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6),/* Validators.pattern('') */]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8),/* Validators.pattern('') */]]
    }, {
        validator: MatchPasswordProvider.MatchPassword
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register() {
    if (this.formRegister.valid) {
      this.paramProvider.presentLoading('Registrando Usuario ...');
      this.userAttribute = [];
      this.userAttribute.push(
        new CognitoAuth.CognitoUserAttribute({
          Name: 'email',
          Value: this.formRegister.value.email
        })
      );
      this.cognitoProvider.signUp(this.formRegister.value.username, this.formRegister.value.password, this.userAttribute).then(
        res => {
          console.log('SignupPage log1: ' + res);
          this.paramProvider.loadingDismiss();
          this.promptVerificationCode(this.formRegister.value.username);
        }, err => {
          console.log('SignupPage log2: ' + err);
          this.paramProvider.loadingDismiss();
          if (err.code === 'UsernameExistsException') {
            this.paramProvider.showAlert('ERROR', 'Nombre de usuario ya existe');
          }
        }
      );
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
            console.log('SignupPage log3: ' + data);
            this.verifyUser(data.verificationCode, username);
          }
        }
      ]
    });

    alert.present();
  }

  verifyUser(verificationCode,username) {
    this.cognitoProvider.confirmUser(verificationCode, username).then(
      res => {
        console.log('SignupPage log4: ' + res);
        this.paramProvider.showToast('Verificación exitosa');
        this.success = true;
      }, err => {
        console.log('SignupPage log5: ' + err);
        this.paramProvider.showToast('No se pudo verificar, intente de nuevo');
        this.success = false;
      }
    );
  }

  resendVerificationCode(username) {
    this.cognitoProvider.resendVerificationCode(this.formRegister.value.username).then(
      res => {
        console.log('SignupPage log6: ' + res);
        this.promptVerificationCode(username);
      }, err => {
        console.log('Signup log7: ' + err);
        this.paramProvider.showToast(err);
      }
    );
  }
}
