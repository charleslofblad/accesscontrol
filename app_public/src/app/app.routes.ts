import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PasserkortComponent } from './components/passerkort/passerkort.component';
import { CardEditorComponent } from './components/card-editor/card-editor.component';
import { AnstalldSpreadsheetComponent } from './components/anstalld-spreadsheet/anstalld-spreadsheet.component';
import { AnstalldSpreadsheetPaginatedComponent } from './components/anstalld-spreadsheet-paginated/anstalld-spreadsheet-paginated.component';


export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'passerkort', component: PasserkortComponent },
  { path: 'card-editor', component: CardEditorComponent },
  { path: 'anstalld-spreadsheet', component: AnstalldSpreadsheetComponent },
  { path: 'anstalld-spreadsheet-paginated', component: AnstalldSpreadsheetPaginatedComponent }
];

/*
CardEditorComponent

import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PasserkortComponent } from './components/passerkort/passerkort.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'passerkort', component: PasserkortComponent }
];



*/