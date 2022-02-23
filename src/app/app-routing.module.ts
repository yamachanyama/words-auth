import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactDetailsComponent } from './contacts/contact-details/contact-details.component';
import { ContactSearchComponent } from './contacts/contact-search/contact-search.component';

const routes: Routes = [
  { path: '', component: ContactListComponent,runGuardsAndResolvers: 'always'},
  { path: "detail/:id", component: ContactDetailsComponent },
  { path: "search", component: ContactSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }