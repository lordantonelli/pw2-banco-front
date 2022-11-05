import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CitiesCreateComponent } from './pages/cities/cities-create/cities-create.component';
import { CitiesEditComponent } from './pages/cities/cities-edit/cities-edit.component';
import { CitiesListComponent } from './pages/cities/cities-list/cities-list.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cities',
    children: [
      { path: '', component: CitiesListComponent },
      { path: 'create', component: CitiesCreateComponent },
      { path: ':id/edit', component: CitiesEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
