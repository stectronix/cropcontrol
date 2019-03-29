import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';
import * as CognitoAuth from "amazon-cognito-identity-js";
import { ParamProvider } from '../../providers/param/param';

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  poolData = {
    UserPoolId: "us-east-1_GJTP4ImyO",
    ClientId: "1o5oqra3k14tm1ugco03vhn0ug"
  };
  formForgot: FormGroup;
  button: string = 'ENVIAR CODIGO';
  errorName: string;
  sw: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public paramProvider: ParamProvider,
    public alertCtrl: AlertController) {

    this.formForgot = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]/* ,Validators.pattern('') */]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  forgotPassword(username, password) {
    if (this.formForgot.valid) {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const cognitoUser = new CognitoAuth.CognitoUser({
        Username: username,
        Pool: userPool
      });

      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.log(result);
        },
        onFailure: function (error) {
          console.log(JSON.stringify(error));
          this.errorName = error.name
        },
        inputVerificationCode() {
            var verificationCode = prompt('Please input verification code ' ,'');
            cognitoUser.confirmPassword(verificationCode, password, this);
        }
      });
      switch (this.errorName) {
        case 'InvalidParameterException':
          this.paramProvider.showToast('No se puede cambiar contraseña a un usuario no confirmado');
          break;
        default:
          break;
      }
    }
  }
}
