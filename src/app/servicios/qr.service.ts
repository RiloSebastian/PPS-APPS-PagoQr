import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { firebaseErrors } from 'src/assets/scripts/errores';
import { ComplementosService } from 'src/app/servicios/complementos.service';

@Injectable({
	providedIn: 'root'
})
export class QrService {
	public usuarioActual: any = null;
	public saldoActual: any = null;
	private qrOptions: BarcodeScannerOptions = {

	}
	private mock = [
		{ codigo10: 0, codigo50: 0, codigo100: 1, saldo: 100, usuario: "invitado@invitado.com" },
		{ codigo10: 0, codigo50: 1, codigo100: 0, saldo: 50, usuario: "anonimo@anonimo.com" },
		{ codigo10: 1, codigo50: 0, codigo100: 1, saldo: 10, usuario: "tester@tester.com" },
		{ codigo10: 0, codigo50: 1, codigo100: 1, saldo: 150, usuario: "usuario@usuario.com" },
		{ codigo10: 0, codigo50: 0, codigo100: 2, saldo: 200, usuario: "admin@admin.com" },
	]
	private codigosQR = [
		{ "codigo": "8c95def646b6127282ed50454b73240300dccabc", "valor": 10 },
		{ "codigo": "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172", "valor": 50 },
		{ "codigo": "2786f4877b9091dcad7f35751bfcf5d5ea712b2f", "valor": 100 }
	]

	constructor(private firestore: AngularFirestore, private qr: BarcodeScanner, private comp: ComplementosService) { }

	eliminarSaldo() {
		this.firestore.collection('pagoQr').doc('subcolecciones').collection('saldos').doc(this.usuarioActual.uid);
	}

	crearSaldo() {
		let saldo = {
			usuario: this.usuarioActual.email,
			saldo: 0,
			codigo10: 0,
			codigo50: 0,
			codigo100: 0,
		}
		this.firestore.collection('pagoQr').doc('subcolecciones').collection('saldos').doc(this.usuarioActual.uid).set(saldo);
	}

	actualizarSaldo(data) {
		this.firestore.collection('pagoQr').doc('subcolecciones').collection('saldos').doc(this.usuarioActual.uid).update(data);
	}

	traerSaldo() {
		this.firestore.collection('pagoQr').doc('subcolecciones').collection('saldos').doc(this.usuarioActual.uid).snapshotChanges().subscribe(saldo => {
			if (saldo.payload.exists) {
				const y: any = saldo.payload.data() as any;
				this.saldoActual = { ...y };
			} else {
				this.crearSaldo();
			}
		});
	}


	scanQr() {
		let valor = null;
		let aumentoSaldo = 0;
		this.qr.scan().then(codigo => {
			if (codigo.text === '2786f4877b9091dcad7f35751bfcf5d5ea712b2f') {
				valor = "codigo100";
				aumentoSaldo = 100;
			} else if (codigo.text === 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172') {
				valor = "codigo50";
				aumentoSaldo = 50;
			} else if (codigo.text == '8c95def646b6127282ed50454b73240300dccabc') {
				valor = "codigo10";
				aumentoSaldo = 10;
			}
			if ((this.usuarioActual.email.includes('admin') && this.saldoActual[valor] < 2) || (!this.usuarioActual.email.includes('admin') && this.saldoActual[valor] < 1)) {
				this.saldoActual[valor]++;
				this.saldoActual.saldo += aumentoSaldo;
				return this.actualizarSaldo(this.saldoActual);
			}
		}).catch(err => this.comp.presentToastConMensajeYColor(firebaseErrors(err), 'danger'));
	}

}
