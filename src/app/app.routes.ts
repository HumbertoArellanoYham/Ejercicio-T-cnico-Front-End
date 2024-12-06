import { Routes } from '@angular/router';

// Import Components
import { FormArticulosComponent } from './form-articulos/form-articulos.component';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/articles' },
    { path: 'articles', component: FormArticulosComponent },
];
