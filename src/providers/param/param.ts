import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';

@Injectable()
export class ParamProvider {

  public device: any;
  public color: any = 'danger';
  public estado: any = 'Desconectado';
  loading;

  constructor(private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    console.log('Hello ParamProvider Provider');
  }

  showAlert(title: string, message: string) {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    });

    alert.present();
  }

  showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      position: 'middle',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Cerrar'
    });

    toast.present();
  }

  loadingBle(time: number) {
    const loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Buscando dispositivos ...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, time);
  }

  presentLoading(message) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: message
    });

    this.loading.present();
  }

  loadingDismiss() {
    this.loading.dismiss();
  }

}
