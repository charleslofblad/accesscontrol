
// denna fil kan tas bort:
// AppModule används inte när vi använder standalone
// men vi låter den vara tom ifall något pekar på den
// (du kan radera denna när inget refererar till AppModule)

export class AppModule {}



/*
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';  // ✅ Använd `provideHttpClient`

import { HotTableModule } from '@handsontable/angular';
//import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { PasserkortComponent } from './components/passerkort/passerkort.component';
import { routes } from './app.routes';
import { CardEditorComponent } from './components/card-editor/card-editor.component'; // ✅ Lägg till denna import


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CardEditorComponent,
    PasserkortComponent
  ],
  imports: [
    BrowserModule,
    HotTableModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideHttpClient(withFetch())  //  Använd istället för HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

*/
//-----------------



 
