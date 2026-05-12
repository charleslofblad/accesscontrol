import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import 'handsontable/styles/ht-theme-main.css';

import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-anstalld-spreadsheet-paginated',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anstalld-spreadsheet-paginated.component.html',
  styleUrls: ['./anstalld-spreadsheet-paginated.component.css']
})
export class AnstalldSpreadsheetPaginatedComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('handsontableContainer', { static: false }) containerRef!: ElementRef<HTMLElement>;

  anstallda: Anstalld[] = [];
  hot!: Handsontable;
  private subscription?: Subscription;
  private radIdMap: string[] = [];

  public skip = 0;
  public limit = 10;
  public total = 0;
  public searchTerm = '';

  constructor(
    private anstalldService: AnstalldService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    // inget här — vi initierar i AfterViewInit
  }

  ngAfterViewInit(): void {
    this.hamtaAnstallda();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.hot) {
      try { this.hot.destroy(); } catch (e) { /* ignore */ }
    }
  }

  /** Hämtar anställda — anpassar sig efter om sökterm finns (server-side sök + paginering) */
  hamtaAnstallda(): void {
    const term = this.searchTerm?.trim();
    const obs = term
      ? this.anstalldService.sokAnstalldPaginerat(term, this.skip, this.limit)
      : this.anstalldService.getPagineradAnstallda(this.skip, this.limit);

    this.subscription?.unsubscribe();
    this.subscription = obs.subscribe({
      next: (res: { anstallda: Anstalld[]; total: number }) => {
        this.anstallda = res.anstallda || [];
        this.total = typeof res.total === 'number' ? res.total : this.anstallda.length;
        this.radIdMap = this.anstallda.map(a => a._id ?? '');

        if (this.hot) {
          this.hot.loadData(this.anstallda);
          this.hot.updateSettings({
            rowHeaders: (index: number) => (this.skip + index + 1).toString()
          });
          this.hot.render();
        } else {
          this.initHandsontable();
        }
      },
      error: (err) => console.error('Fel vid hämtning av anställda:', err)
    });
  }

  onSearch(): void {
    this.skip = 0;
    this.hamtaAnstallda();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.skip = 0;
    this.hamtaAnstallda();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.skip = (page - 1) * this.limit;
    this.hamtaAnstallda();
  }

  nasta(): void {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.hamtaAnstallda();
    }
  }

  tillbaka(): void {
    if (this.skip - this.limit >= 0) {
      this.skip -= this.limit;
      this.hamtaAnstallda();
    }
  }

  pagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  get currentPage(): number {
    return Math.floor(this.skip / this.limit) + 1;
  }

  get visningStart(): number {
    return Math.min(this.total, this.skip + 1);
  }

  get visningSlut(): number {
    // använd faktisk laddad mängd för sista sidan
    return Math.min(this.total, this.skip + this.anstallda.length);
  }

  initHandsontable(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.hot) return;
    if (!this.containerRef) return;

    const container = this.containerRef.nativeElement;

    this.hot = new Handsontable(container, {
      data: this.anstallda,
      columns: [
        { data: 'Fornamn', type: 'text', title: 'Förnamn' },
        { data: 'Efternamn', type: 'text', title: 'Efternamn' },
        { data: 'Personnummer', type: 'text', title: 'Personnummer' },
        { data: 'Roll', type: 'text', title: 'Roll' },
        { data: 'Chef', type: 'text', title: 'Chef' },
        {
          data: 'Layout',
          type: 'dropdown',
          title: 'Org',
          source: ['Stockholmståg', 'SJ', 'Konsult', 'Götalandståg', 'Norlandståg', 'Krösa'],
          strict: true,
          allowInvalid: false
        },
        { data: 'Foretag', type: 'text', title: 'Företag' },
        { data: 'Tjanstekort.Datum', type: 'numeric', title: 'Datum' },
        { data: 'Tjanstekort.EM_kod', type: 'numeric', title: 'EM Kod', allowEmpty: true },
        { data: 'Tjanstekort.Mifare_kod', type: 'numeric', title: 'Mifare Kod', allowEmpty: true },
        { data: 'Tjanstekort.Alliera_Bla', type: 'text', title: 'Alliera Blå', allowEmpty: true },
        { data: 'Tjanstekort.Alliera_Gron', type: 'text', title: 'Alliera Grön', allowEmpty: true },
        { data: 'Tjanstekort.RCO', type: 'numeric', title: 'RCO', allowEmpty: true }
      ],
      colHeaders: true,
      rowHeaders: (index: number) => (this.skip + index + 1).toString(),
      filters: true,
      dropdownMenu: true,
      search: true,
      licenseKey: 'non-commercial-and-evaluation',
      stretchH: 'all',
      width: '100%',        // tar hela containerbredden
      height: 'auto',       // anpassar höjd till antal rader
      autoWrapRow: false,
      autoWrapCol: false,
      contextMenu: {
        items: {
          'add_above': {
            name: '➕ Lägg till rad ovanför',
            callback: (_: any, selection: any) => {
              const rowIndex = selection[0].start.row;
              this.laggTillNyAnstalld(rowIndex);
            }
          },
          'add_below': {
            name: '➕ Lägg till rad under',
            callback: (_: any, selection: any) => {
              const rowIndex = selection[0].start.row + 1;
              this.laggTillNyAnstalld(rowIndex);
            }
          },
          'remove_row': {
            name: '🗑️ Ta bort rad',
            callback: (_: any, selection: any) => {
              const rowIndex = selection[0].start.row;
              this.raderaAnstalld(rowIndex);
            }
          },
          'radera_markerad': {
            name: '🗑️ Ta bort markerad rad',
            callback: () => this.raderaMarkeradRad()
          },
          '---------': {},
          undo: {},
          redo: {}
        }
      },
      afterChange: (changes: any[] | null, source: string) => {
        if (!changes || source === 'loadData') return;
        this.handleChanges(changes, source);
      }
    });
  }

  /** Lokalt snabbfilter via Handsontable search-plugin */
  searchTableLocal(evt: Event): void {
    const value = (evt.target as HTMLInputElement).value;
    if (!this.hot) return;
    const searchPlugin = this.hot.getPlugin('search') as any;
    searchPlugin.query(value);
    this.hot.render();
  }

  raderaAnstalld(radIndex: number): void {
    const id = this.radIdMap[radIndex];
    const anstalld = this.anstallda[radIndex];

    if (!id) {
      console.warn('⚠️ Kan inte radera: saknar _id');
      return;
    }

    if (!confirm(`Är du säker på att du vill radera ${anstalld.Fornamn} ${anstalld.Efternamn}?`)) {
      return;
    }

    this.anstalldService.raderaAnstalld(id).subscribe({
      next: () => {
        this.anstallda.splice(radIndex, 1);
        this.radIdMap.splice(radIndex, 1);
        this.total = Math.max(0, this.total - 1);
        if (this.hot) this.hot.loadData(this.anstallda);
      },
      error: (err) => console.error('❌ Fel vid radering:', err)
    });
  }

  /** Hanterar ändringar från Handsontable och sparar */
  handleChanges(changes: any[], source: string): void {
    if (source !== 'edit' || !changes) return;

    changes.forEach(([row, prop, oldValue, newValue]: any) => {
      if (oldValue === newValue) return;

      const anstalld = this.anstallda[row];
      if (!anstalld) return;

      // Om property är t.ex. "Tjanstekort.Datum"
      if (typeof prop === 'string' && prop.includes('.')) {
        const [root, child] = prop.split('.');
        if (root === 'Tjanstekort') {
          const updatedTjanstekort = { ...(anstalld.Tjanstekort || {}), [child]: newValue };
          const updatedAnstalld = ({ ...anstalld, Tjanstekort: updatedTjanstekort } as unknown) as Anstalld;
          this.anstallda[row] = updatedAnstalld;
          this.sparaAnstalld(updatedAnstalld);
          return;
        }
      }

      // Enkel property
      const updatedAnstalld = ({ ...anstalld, [prop]: newValue } as unknown) as Anstalld;
      this.anstallda[row] = updatedAnstalld;
      this.sparaAnstalld(updatedAnstalld);
    });
  }

  laggTillNyAnstalld(insertionIndex?: number): void {
    const nyAnstalld: Anstalld = {
      Anstallda_ID: 0,
      Fornamn: '',
      Efternamn: '',
      Personnummer: '',
      Reff_Pnr: '',
      Roll: '',
      Chef: '',
      Layout: '',
      Foretag: '',
      Tjanstekort: {
        Tjanstekort_ID: 0,
        Datum: Date.now(),
        EM_kod: undefined,
        Mifare_kod: undefined,
        Alliera_Bla: '',
        Alliera_Gron: '',
        RCO: undefined
      }
    };

    this.anstalldService.skapaAnstalld(nyAnstalld).subscribe({
      next: (skapad: Anstalld) => {
        if (typeof insertionIndex === 'number') {
          this.anstallda.splice(insertionIndex, 0, skapad);
        } else {
          this.anstallda.push(skapad);
        }
        this.radIdMap = this.anstallda.map(a => a._id ?? '');
        this.total = this.total + 1;
        if (this.hot) this.hot.loadData(this.anstallda);
      },
      error: (err) => console.error('❌ Fel vid skapande av anställd:', err)
    });
  }

  sparaAnstalld(updatedAnstalld: Anstalld): void {
    if (!updatedAnstalld._id) {
      console.warn('⚠️ Kan inte uppdatera – saknar _id på anställd:', updatedAnstalld);
      return;
    }
    this.anstalldService.uppdateraAnstalld(updatedAnstalld._id, updatedAnstalld).subscribe({
      next: () => console.log('✅ Anställd uppdaterad:', updatedAnstalld),
      error: (err) => console.error('❌ Fel vid uppdatering:', err)
    });
  }

  raderaMarkeradRad(): void {
    const selected = this.hot.getSelected();
    if (selected && selected.length > 0) {
      const radIndex = selected[0][0];
      this.raderaAnstalld(radIndex);
    } else {
      alert('❗ Välj en rad att ta bort.');
    }
  }
}
