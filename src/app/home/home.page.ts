import { Component, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { UsuarioService } from '../servicios/usuario.service';
import { ComplementosService } from 'src/app/servicios/complementos.service';
import { firebaseErrors } from 'src/assets/scripts/errores';
import { QrService } from 'src/app/servicios/qr.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
	public usuario: any = null;
	public sub = null;

	constructor(private router: Router, private auth: UsuarioService, private comp: ComplementosService, private qr: QrService) {}

	ngOnInit(): void {
		console.log('accede a usuario');
		this.sub = this.auth.usuario.subscribe(user => {
			if (user !== null) {
				this.usuario = user;
				this.qr.usuarioActual = user;
				this.qr.traerSaldo();
				console.log(this.usuario);
			}
		});
	}

	eliminarSaldo(){
		let saldo = {
			usuario: this.usuario.email,
			saldo: 0,
			codigo10: 0,
			codigo50: 0,
			codigo100: 0,
		}
		this.qr.actualizarSaldo(saldo);
	}

	escanear(){
		this.qr.scanQr();
	}


	public cerrarSesion() {
		this.auth.logout().then(() => {
			this.comp.playAudio('error');
			this.router.navigate(['/'])
		});
	}

	public ngOnDestroy(): void {
		if (this.sub !== null) {
			this.sub.unsubscribe();
		}
	}
}
