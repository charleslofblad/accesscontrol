// app_public\src\app\services\anstalld.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Anstalld } from '../models/anstalld.model';

@Injectable({
  providedIn: 'root'
})
export class AnstalldService {
  private apiUrl = 'http://localhost:8000/api/anstallda/';

  constructor(private http: HttpClient) {}

// 
  getByMifare(kod: string): Observable<Anstalld> {
    return this.http.get<Anstalld>(`${this.apiUrl}mifare/${kod}`);
  }

  
  /** Hämta alla anställda */
  getAnstallda(): Observable<Anstalld[]> {
    return this.http.get<Anstalld[]>(this.apiUrl).pipe(
      tap(data => console.log('Hämtade anställda:', data)),
      catchError(err => this.handleError(err, 'getAnstallda'))
    );
  }


  getAnstalldById(id: string): Observable<Anstalld> {
    return this.http.get<Anstalld>(`${this.apiUrl}${id}`).pipe(
      tap(data => console.log(`Hämtade anställd ${id}:`, data)),
      catchError(err => this.handleError(err, 'getAnstalldById'))
    );
  }


 /** Sök anställda via endpoint med delvis sökning via URL-param */
 /*
sokAnstalld(sokterm: string): Observable<Anstalld[]> {
  return this.http.get<Anstalld[]>(`${this.apiUrl}sok/${encodeURIComponent(sokterm)}`).pipe(
    tap(data => console.log('Sökresultat:', data)),
    catchError(err => this.handleError(err, 'sokAnstalld'))
  );
}
*/
/** V2 Sök med paginering */
/** Server-side sök + paginering (HUVUDMETOD) */
sokAnstalldPaginerat(search: string = '', skip: number = 0, limit: number = 100): Observable<{ anstallda: Anstalld[], total: number }> {
  const params = new HttpParams()
    .set('search', search)
    .set('skip', skip.toString())
    .set('limit', limit.toString());

  // 👇 Ändra denna rad:
  return this.http.get<{ anstallda: Anstalld[], total: number }>(
    `${this.apiUrl}paginerad-sok`,   // ✅ rätt endpoint
    { params }
  ).pipe(
    tap(data => console.log('Paginering sökresultat:', data)),
    catchError(err => this.handleError(err, 'sokAnstalldPaginerat'))
  );
}

getAnstalldaPaginerat(skip: number = 0, limit: number = 100): Observable<{ anstallda: Anstalld[], total: number }> {
  return this.sokAnstalldPaginerat('', skip, limit);
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

// exportera till word
exportToWord(id: string) {
  return this.http.get(`/api/export/person/${id}`, { responseType: 'blob' });
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