import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'add-location',
    loadChildren: () => import('./add-location/add-location.module').then(m => m.AddLocationPageModule)
  },
  {
    path: 'add-collection',
    loadChildren: () => import('./add-collection/add-collection.module').then(m => m.AddCollectionPageModule)
  },
  {
    path: 'edit-collection/:id',
    loadChildren: () => import('./edit-collection/edit-collection.module').then(m => m.EditCollectionPageModule)
  },
  {
    path: 'edit-location/:id',
    loadChildren: () => import('./edit-location/edit-location.module').then(m => m.EditLocationPageModule)
  },
  {
    path: 'view-location/:id',
    loadChildren: () => import('./view-location/view-location.module').then(m => m.ViewLocationModule)
  },
  {
    path: 'view-position',
    loadChildren: () => import('./view-position/view-position.module').then(m => m.ViewPositionModule)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
// @ts-ignore
export class AppRoutingModule {
}
