
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Anstalld } from '../models/anstalld.model';

@Injectable({
  providedIn: 'root'
})
export class AnstalldService {
  private apiUrl = 'http://localhost:8000/api/anstallda/';

  constructor(private http: HttpClient) {}

  getAnstallda(): Observable<Anstalld[]> {
    return this.http.get<Anstalld[]>(this.apiUrl).pipe(
      tap(data => console.log("Hämtade anställda:", data)),
      catchError(error => this.handleError(error))
    );
  }


  sokAnstalld(sokterm: string): Observable<Anstalld[]> {
    return this.http.get<Anstalld[]>(`${this.apiUrl}sok/${encodeURIComponent(sokterm)}`).pipe(
      tap(data => console.log("Sökresultat:", data)),
      catchError(error => this.handleError(error))
    );
  }
/* första version 1
  uppdateraAnstalld(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
*/
  uppdateraAnstalld(id: string, data: any): Observable<any> {
    const payload = { ...data };
  
    // Kontrollera och formattera Tjanstekort korrekt
    if (data.Tjanstekort) {
      payload.Tjanstekort = { ...data.Tjanstekort };
    }
  
    console.log('Skickar uppdatering till API:', payload);
  
    return this.http.put(`${this.apiUrl}${id}`, payload).pipe(
      tap(() => console.log('Uppdatering lyckades')),
      catchError(error => {
        console.error('Fel vid uppdatering:', error);
        return throwError(() => error);
      })
    );
  }
  



  /** Skapa en ny anställd 
  skapaAnstalld(anstalld: Anstalld): Observable<Anstalld> {
    return this.http.post<Anstalld>(this.apiUrl, anstalld).pipe(
      tap(response => console.log('Ny anställd skapad:', response)),
      catchError(error => this.handleError(error))
    );
  }  
*/

  /** Skapa en ny anställd */
skapaAnstalld(anstalld: Anstalld): Observable<Anstalld> {
  console.log('Skickar följande data till API:', anstalld); // Loggar data som skickas

  return this.http.post<Anstalld>(this.apiUrl, anstalld).pipe(
    tap(response => console.log('Ny anställd skapad:', response)), // Loggar svaret från API:t
    catchError(error => this.handleError(error))
  );
}


private handleError(error: any): Observable<never> {
  console.error('API-fel:', error.message || error);
  return throwError(() => new Error(`Kunde inte hämta data: ${error.message || 'Okänt fel'}`));
 }

 /** Radera en anställd */
raderaAnstalld(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}${id}`).pipe(
    tap(() => console.log(`🗑️ Anställd med ID ${id} raderad`)),
    catchError(error => this.handleError(error))
  );
}


}

/*
  private handleError(error: any): Observable<never> {
    console.error("Ett fel uppstod vid API-anrop:", error);
    return throwError(() => new Error('Kunde inte hämta data. Kontrollera servern och försök igen.'));
  }
}
  */


/*
import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Anstalld } from '../models/anstalld.model';

@Injectable({
  providedIn: 'root'
})
export class AnstalldService {
  private apiUrl = 'http://localhost:8000/api/anstallda/'; // API fungerar

  constructor(private http: HttpClient) {}

  getAnstallda(): Observable<Anstalld[]> {
    console.log("Försöker hämta anställda från API...");
    return this.http.get<Anstalld[]>(this.apiUrl).pipe(
      tap(data => {
        console.log("Hämtade anställda från API:", data);
        if (!data || data.length === 0) {
          console.warn("Varning: API returnerade en tom lista.");
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    console.error("Ett fel uppstod vid API-anrop:", error);
    if (error.status === 0) {
      console.error("Kan inte ansluta till servern. Kontrollera om backend är igång.");
    } else {
      console.error(`Felstatus: ${error.status}, Meddelande: ${error.message}`);
    }
    return throwError(() => new Error('Ett fel uppstod vid hämtning av data. Kontrollera servern och försök igen.'));
  }
}
*/