import { Component } from '@angular/core';
import { DataPage } from '../data/data';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { Platform, App, AlertController } from 'ionic-angular';
import { ParamProvider } from '../../providers/param/param';
import { BLE } from '@ionic-native/ble';
import { AboutPage } from '../about/about';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = BluetoothPage;
	tab2Root = DataPage;
	tab3Root = AboutPage;
	device;

	constructor(public platform: Platform,
		public app: App,
		public alertCtrl: AlertController,
		public data: ParamProvider,
		private ble: BLE) {

		this.device = this.data.device;

		platform.registerBackButtonAction(() => {
			let nav = app.getActiveNavs()[0];
			if (nav.canGoBack()) { //Can we go back?
				nav.pop();
			} else {
				const alert = this.alertCtrl.create({
					title: 'Salir',
					message: '¿Está seguro que desea salir de la aplicación?',
					buttons: [{
						text: 'Cancelar',
						role: 'cancel',
						handler: () => {
							console.log('Tabs log1: Salida de la aplicacion cancelada!');
						}
					}, {
						text: 'Salir de la aplicación',
						handler: () => {
							if (this.device != null) {
								console.log('Tabs log2: Conectado a ' + (this.device.id || this.device.name));
								this.ble.disconnect(this.device.id);
							} else {
								console.log('Tabs log3: Device vacío');
							}
							this.platform.exitApp(); // Close this application
						}
					}]
				});
				alert.present();
			}
		});
	}
}
