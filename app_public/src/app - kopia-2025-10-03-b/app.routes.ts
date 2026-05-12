import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PasserkortComponent } from './components/passerkort/passerkort.component';
import { CardEditorComponent } from './components/card-editor/card-editor.component';
import { AnstalldSpreadsheetComponent } from './components/anstalld-spreadsheet/anstalld-spreadsheet.component';
import { AnstalldSpreadsheetPaginatedComponent } from './components/anstalld-spreadsheet-paginated/anstalld-spreadsheet-paginated.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';


export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'passerkort', component: PasserkortComponent },
  { path: 'card-editor', component: CardEditorComponent },
  { path: 'card-editor/:id', component: CardEditorComponent }, // ← Ny route med ID
  { path: 'anstalld-spreadsheet', component: AnstalldSpreadsheetComponent },
  { path: 'anstalld-spreadsheet-paginated', component: AnstalldSpreadsheetPaginatedComponent },
  { path: 'card-list', component: CardListComponent },
  { path: 'card-detail/:id', component: CardDetailComponent },
  { path: 'passerkort/:id', component: PasserkortComponent},
  { path: '', redirectTo: '/card-list', pathMatch: 'full' }
];
