import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CognitoAuth from "amazon-cognito-identity-js";
import { AlertController } from 'ionic-angular';

@Injectable()
export class CognitoServiceProvider {

  poolData = {
    UserPoolId: "us-east-1_GJTP4ImyO",
    ClientId: "1o5oqra3k14tm1ugco03vhn0ug"
  };

  constructor(public http: HttpClient,
    private alertCtrl: AlertController) {
    console.log('Hello CognitoServiceProvider Provider');
  }

  signUp(username, password, userAttribute) {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      userPool.signUp(username, password, userAttribute, null, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  confirmUser(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const cognitoUser = new CognitoAuth.CognitoUser({
        Username: userName,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  resendVerificationCode(userName) {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const cognitoUser = new CognitoAuth.CognitoUser({
        Username: userName,
        Pool: userPool
      });

      cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      })
    });
  }

  authenticate(username, password) {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const authDetails = new CognitoAuth.AuthenticationDetails({
        Username: username,
        Password: password
      });

      const cognitoUser = new CognitoAuth.CognitoUser({
        Username: username,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          resolved(result);
        },
        onFailure: err => {
          reject(err);
        }
      });
    });
  }

  getUser() {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        resolved(cognitoUser);
      } else {
        reject('Sesión no iniciada');
      }
    });
  }

  getUserAtributes(username) {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const cognitoUser = new CognitoAuth.CognitoUser({
        Username: username,
        Pool: userPool
      });

      cognitoUser.getUserAttributes(function (err, result) {
        if (err) {
          reject(err);
        } else {
          result.forEach(element => {
            resolved(element);
          });
        }
      });
    });
  }

  signOut() {
    return new Promise((resolved, reject) => {
      const userPool = new CognitoAuth.CognitoUserPool(this.poolData);

      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.signOut();
        resolved('Sesión cerrada');
      } else {
        reject('Sesión no iniciada');
      }
    });
  }
}
