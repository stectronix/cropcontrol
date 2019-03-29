import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ParamProvider } from '../../providers/param/param';
import { BLE } from '@ionic-native/ble';

const SERVICE = 'ed73f59a-ed70-446f-a16e-15dc239938cd';
const CHARACTERISTIC = '8f1f517a-c0d5-4468-896c-638487ed8b50';

@Component({
	selector: 'page-data',
	templateUrl: 'data.html'
})
export class DataPage {
	peripheral: any = {};
	device;
	json;
	color;
	estado;
	showComp = false;
	T;
	HA;
	CO;
	IL;
	GL;
	TS;
	HS1;
	HS2;

	constructor(public navCtrl: NavController,
		public data: ParamProvider,
		private ble: BLE) {

		setInterval(() => {
			if (data.estado == 'Desconectado') {
				this.color = this.data.color;
				this.estado = this.data.estado;
				this.showComp = false;
			}
		},1000);

	}

	ionViewDidEnter() {
		this.color = this.data.color;
		this.estado = this.data.estado;
		this.device = this.data.device;
		if (this.device != null) {
			console.log('DataPage log1: Conectado a ' + (this.device.id || this.device.name));
			this.ble.read(this.device.id, SERVICE, CHARACTERISTIC).then(
				data => this.onReadData(data),
				error => {
					console.log('DataPage log2: Error al leer ' + JSON.stringify(error));
					this.data.showAlert('ERROR', 'Falla al recibir datos');
					this.data.showToast((this.device.name || this.device.id) + ' Desconectado');
					this.data.device = null;
					this.device = null
					this.data.color = 'danger';
					this.data.estado = 'Desconectado';
					this.color = this.data.color;
					this.estado = this.data.estado;
					this.showComp = false;
				}
			);
		} else {
			console.log('DataPage log4: Device vacío');
			this.showComp = false;
		}
	}

	onReadData(buffer: ArrayBuffer) {
		var data = new Uint8Array(buffer);
		this.json = String.fromCharCode.apply(null, new Uint8Array(data));
		console.log('DataPage log5: Json recibido ' + this.json);
		let aux = JSON.parse(this.json)
		this.showComp = true;
		this.T = aux.id;
		this.HA = aux.version;
		this.CO = aux.power;
		this.IL = aux.platform.status;
		this.GL = aux.platform.last_event.date;
		this.TS = aux.platform.last_event.richter;
		this.HS1 = aux.platform.last_event.mercalli;
		this.HS2 = aux.alarm;
	}
}
