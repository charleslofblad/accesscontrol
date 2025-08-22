
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
//import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Anstalld } from '../models/anstalld.model';

@Injectable({
  providedIn: 'root'
})
export class AnstalldService {
  private apiUrl = 'http://localhost:8000/api/anstallda/';

  constructor(private http: HttpClient) {}

  /** Hämta alla anställda */
  getAnstallda(): Observable<Anstalld[]> {
    return this.http.get<Anstalld[]>(this.apiUrl).pipe(
      tap(data => console.log('Hämtade anställda:', data)),
      catchError(err => this.handleError(err, 'getAnstallda'))
    );
  }
  
/*
  getAnstallda(skip: number, limit: number): Observable<{ data: Anstalld[]; total: number }> {
    return this.http.get<{ data: Anstalld[]; total: number }>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }
  */
  /** Hämta en enskild anställd */
  getAnstalldById(id: string): Observable<Anstalld> {
    return this.http.get<Anstalld>(`${this.apiUrl}${id}`).pipe(
      tap(data => console.log(`Hämtade anställd ${id}:`, data)),
      catchError(err => this.handleError(err, 'getAnstalldById'))
    );
  }

 /** Sök anställda via endpoint med delvis sökning via URL-param */
sokAnstalld(sokterm: string): Observable<Anstalld[]> {
  return this.http.get<Anstalld[]>(`${this.apiUrl}sok/${encodeURIComponent(sokterm)}`).pipe(
    tap(data => console.log('Sökresultat:', data)),
    catchError(err => this.handleError(err, 'sokAnstalld'))
  );
}

 /** Ny metod: Sök med paginering och sökterm via query-parametrar */
 sokAnstalldPaginerat(search: string = '', skip: number = 0, limit: number = 100): Observable<{ anstallda: Anstalld[], total: number }> {
  const params = new HttpParams()
    .set('search', search)
    .set('skip', skip.toString())
    .set('limit', limit.toString());

  return this.http.get<{ anstallda: Anstalld[], total: number }>(`${this.apiUrl}sok`, { params }).pipe(
    tap(data => console.log('Paginering sökresultat:', data)),
    catchError(err => this.handleError(err, 'sokAnstalldPaginerat'))
  );
}
// denna är ersätta getAnstallda() med en metod som alltid returnerar paginerad data via din sokAnstalldPaginerat()
// även om du inte skickar med sökterm.
getAnstalldaPaginerat(skip: number = 0, limit: number = 100): Observable<{ anstallda: Anstalld[], total: number }> {
  return this.sokAnstalldPaginerat('', skip, limit);
}

// version 2
getAnstalldaPaginerad(skip: number, limit: number) {
  return this.http.get<Anstalld[]>(`${this.apiUrl}/paginerad-sok?skip=${skip}&limit=${limit}`);
}

getPagineradAnstallda(skip: number, limit: number): Observable<{ anstallda: Anstalld[], total: number }> {
  const params = new HttpParams()
    .set('skip', skip.toString())
    .set('limit', limit.toString());

  return this.http.get<{ anstallda: Anstalld[], total: number }>(`${this.apiUrl}paginerat`, { params }).pipe(
    tap(data => console.log('Paginerade anställda:', data)),
    catchError(err => this.handleError(err, 'getPagineradAnstallda'))
  );
}


skapaAnstalld(anstalld: Anstalld): Observable<Anstalld> {
  return this.http.post<Anstalld>(this.apiUrl, anstalld).pipe(
    tap(res => console.log('Ny anställd skapad:', res)),
    catchError(err => this.handleError(err, 'skapaAnstalld'))
  );
}

uppdateraAnstalld(id: string, data: Partial<Anstalld & { Layout?: string }>): Observable<Anstalld> {
  console.log('Skickar uppdatering till API:', data);
  return this.http.put<Anstalld>(`${this.apiUrl}${id}`, data).pipe(
    tap(res => console.log(`Anställd ${id} uppdaterad:`, res)),
    catchError(err => this.handleError(err, 'uppdateraAnstalld'))
  );
}

raderaAnstalld(id: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.apiUrl}${id}`).pipe(
    tap(() => console.log(`Anställd ${id} raderad`)),
    catchError(err => this.handleError(err, 'raderaAnstalld'))
  );
}

/**
 * Felhantering för alla anropsmetoder.
 * @param error Det fångade felet.
 * @param operation Valfritt namn på operationen.
 */
private handleError(error: any, operation = 'operation'): Observable<never> {
  console.error(`Fel i AnstalldService.${operation}:`, error);
  return throwError(() => new Error(`${operation} misslyckades: ${error.message || error}`));
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