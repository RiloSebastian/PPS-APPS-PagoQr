import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { HomePage } from './home/home.page';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'

const noLogueado = () => redirectUnauthorizedTo(['Login']);
const logueado = () => redirectLoggedInTo(['Home']);

const routes: Routes = [
	{ path: '', redirectTo: 'Login', pathMatch: 'full' },
	{ path: 'Login', component: LoginPage, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: logueado } },
	{ path: 'Home', component: HomePage, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: noLogueado } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
