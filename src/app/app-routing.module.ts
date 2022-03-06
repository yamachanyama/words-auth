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
  //https://qiita.com/ParisMichael/items/6a1bed373f0bf4ce755d
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }