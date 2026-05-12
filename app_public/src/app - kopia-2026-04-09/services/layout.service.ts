// src/app/services/layout.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Layout {
  _id: string;
  name: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private base = 'http://localhost:8000/api/anstallda/layouts';

  constructor(private http: HttpClient) {}

  /** Hämta alla layouter */
  getLayouts(): Observable<Layout[]> {
    return this.http.get<Layout[]>(this.base);
  }

  /** Hämta en layout via dess ID */
  getLayout(id: string): Observable<Layout> {
    return this.http.get<Layout>(`${this.base}/${id}`);
  }

  /** Hämta layout via dess namn */
  getLayoutByName(name: string): Observable<Layout> {
  return this.http.get<Layout>(`${this.base}/by-name/${encodeURIComponent(name)}`);
  }

  /** Skapa en ny layout */
  createLayout(name: string, data: any): Observable<Layout> {
    return this.http.post<Layout>(this.base, { name, data });
  }

  /** Uppdatera en befintlig layout */
  updateLayout(id: string, name: string, data: any): Observable<Layout> {
    return this.http.put<Layout>(`${this.base}/${id}`, { name, data });
  }

  /** Ta bort en layout */
  deleteLayout(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
