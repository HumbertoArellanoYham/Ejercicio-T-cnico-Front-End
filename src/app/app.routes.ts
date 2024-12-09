import { Routes } from '@angular/router';

// Import Components
import { FormArticulosComponent } from './form-articulos/form-articulos.component';
import { MainViewComponent } from './main-view/main-view.component';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/mainview' },
    { path: 'articles', component: FormArticulosComponent },
    { path: 'mainview', component: MainViewComponent  },
];
