
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Anstalld } from '../models/anstalld.model';
import { AnstalldService } from '../services/anstalld.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFacade {

  // =====================================================
  // STATE
  // =====================================================

  private employeesSubject = new BehaviorSubject<Anstalld[]>([]);
  readonly employees$ = this.employeesSubject.asObservable();

  private selectedIndexSubject = new BehaviorSubject<number>(-1);
  readonly selectedIndex$ = this.selectedIndexSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  readonly error$ = this.errorSubject.asObservable();

  readonly selectedEmployee$ = combineLatest([
    this.employees$,
    this.selectedIndex$
  ]).pipe(
    map(([employees, index]) =>
      index >= 0 && index < employees.length ? employees[index] : null
    )
  );

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(private anstalldService: AnstalldService) {}

  // =====================================================
  // SNAPSHOT GETTERS (imperative access)
  // =====================================================

  get employees(): Anstalld[] {
    return this.employeesSubject.value;
  }

  get selectedIndex(): number {
    return this.selectedIndexSubject.value;
  }

  get selectedEmployee(): Anstalld | null {
    const index = this.selectedIndex;
    const list = this.employees;
    return index >= 0 && index < list.length ? list[index] : null;
  }

  // =====================================================
  // ACTIONS – STATE MUTATIONS
  // =====================================================

  setEmployees(list: Anstalld[]): void {
    this.employeesSubject.next(list);

    if (list.length > 0) {
      this.selectedIndexSubject.next(0);
    } else {
      this.selectedIndexSubject.next(-1);
    }
  }

  setSelectedIndex(index: number): void {
    if (index >= 0 && index < this.employees.length) {
      this.selectedIndexSubject.next(index);
    }
  }

  next(): void {
    const nextIndex = this.selectedIndex + 1;
    if (nextIndex < this.employees.length) {
      this.selectedIndexSubject.next(nextIndex);
    }
  }

  previous(): void {
    const prevIndex = this.selectedIndex - 1;
    if (prevIndex >= 0) {
      this.selectedIndexSubject.next(prevIndex);
    }
  }

  // =====================================================
  // BUSINESS ACTIONS
  // =====================================================

  searchEmployees(term: string): void {

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.anstalldService
      .sokAnstalldPaginerat(term, 0, 500)
      .subscribe({
        next: (res: any) => {
          const list = res?.anstallda ?? [];
          this.setEmployees(list);
          this.loadingSubject.next(false);
        },
        error: (err) => {
          console.error('❌ Error searching employees:', err);
          this.errorSubject.next('Kunde inte söka anställda');
          this.loadingSubject.next(false);
        }
      });
  }
}

