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

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
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


//-----------------


 
