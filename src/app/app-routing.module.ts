import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from './guards/authentication.guard';
import { PageComponent } from './layout/page/page.component';
import { CitiesCreateComponent } from './pages/cities/cities-create/cities-create.component';
import { CitiesEditComponent } from './pages/cities/cities-edit/cities-edit.component';
import { CitiesListComponent } from './pages/cities/cities-list/cities-list.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'cities',
        children: [
          { path: '', component: CitiesListComponent },
          { path: 'create', component: CitiesCreateComponent },
          { path: ':id/edit', component: CitiesEditComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
