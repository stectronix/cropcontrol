import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from "@ionic-native/ble";
import { ParamProvider } from '../../providers/param/param';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';

@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage {

  devices: any[] = [];
  mobilePlatform = 'android';
  device;
  color;
  estado;

  constructor(public navCtrl: NavController,
    private ble: BLE,
    private ngZone: NgZone,
    public data: ParamProvider,
    public cognitoProvider: CognitoServiceProvider) {

  }

  ionViewDidEnter() {
    this.color = this.data.color;
    this.estado = this.data.estado;
    this.device = this.data.device;
    if (this.device != null) {
      console.log('BluetoothPage log1: Conectado a ' + (this.device.id || this.device.name))
    } else {
      console.log('BluetoothPage log2: Device vacío');
    }
  }

  initializeBle() {
    this.devices = [];
    if (this.mobilePlatform === 'ios') {
      this.data.loadingBle(5000);
      this.scan();
    } else {
      this.ble.isEnabled().then(() => {
        console.log('BluetoothPage log3: Bluetooth is enabled');
        this.data.loadingBle(5000);
        this.scan();
      }, () => {
        console.log('BluetoothPage log4: Bluetooth is *not* enabled');
        this.ble.enable().then(success => {
          console.log('BluetoothPage log5: Bluetooth activado ' + success);
          this.data.loadingBle(5000);
          this.scan();
        }, failure => {
          console.log('BluetoothPage log6: Bluetooth no activado ' + failure);
          this.data.showToast('Bluetooth no disponible, intente de nuevo');
        });
      });
    }
  }

  scan() {
    this.ble.scan([], 5).subscribe(
      device => {
        this.onDeviceDiscovered(device)
      },
      error => {
        this.scanError(error)
      }
    );
  }

  onDeviceDiscovered(device) {
    console.log('BluetoothPage log7: Descubierto ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  scanError(error) {
    console.log('BluetoothPage log8: Error ' + error);
    this.data.showToast('Error al escanear dispositivos Bluetooth');
  }

  disconnect() {
    if (this.device == null) {
      this.data.showToast('No se encuentra conectado a ninguún dispositivo');
    } else {
      this.ble.isConnected(this.device.id).then(() => {
        this.ble.disconnect(this.device.id);
        this.data.showToast((this.device.name || this.device.id) + ' Desconectado');
        this.data.device = null;
        this.device = null
        this.data.color = 'danger';
        this.data.estado = 'Desconectado';
        this.color = this.data.color;
        this.estado = this.data.estado;
      });
    }
  }

  deviceSelected(device) {
    console.log('BluetoothPage log9: ' + JSON.stringify(device.name) + ' seleccionado');
    this.data.presentLoading('Conectando...');
    this.ble.connect(device.id).subscribe(
      peripheral => {
        console.log('BluetoothPage log 10: Conectado a ' + (peripheral.name || peripheral.id));
        this.data.color = 'secondary';
        this.data.estado = 'Conectado';
        this.data.device = peripheral;
        this.navCtrl.parent.select(1);
        this.devices = [];
        this.data.loadingDismiss();
      },
      error => {
        console.log('BluetoothPage log11: Error al conectar ' + JSON.stringify(error));
        this.data.showToast('Error al conectar dispositivo');
        this.data.device = null;
        this.device = null
        this.data.color = 'danger';
        this.data.estado = 'Desconectado';
        this.color = this.data.color;
        this.estado = this.data.estado;
        this.data.loadingDismiss();
      }
    );
  }
}
