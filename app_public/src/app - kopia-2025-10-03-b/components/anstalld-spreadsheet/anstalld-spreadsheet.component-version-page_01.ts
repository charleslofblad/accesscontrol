
//AI verson första med-----------------------------------------------------------------------------------
/*
Här är en fullständigt renskriven och konsoliderad version av din komponent där jag har:

Rensat bort gammal kod.

Slagit ihop din version 3 och 4.

Strukturerat om kod för bättre läsbarhet.

Lagt till paginering, sökning, context-menu med anpassade alternativ.

Säkrat att all databehandling, inklusive Tjanstekort, hanteras korrekt.

Rensat onödig kod och tydliggjort eventloggar.
*/
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';
import Handsontable from 'handsontable';
import { Subscription } from 'rxjs';
import 'handsontable/dist/handsontable.full.min.css';
import 'handsontable/styles/ht-theme-main.css';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-anstalld-spreadsheet',
  templateUrl: './anstalld-spreadsheet.component.html',
  styleUrls: ['./anstalld-spreadsheet.component.css']
})
export class AnstalldSpreadsheetComponent implements OnInit, OnDestroy {
  @ViewChild('handsontableContainer', { static: false }) containerRef!: ElementRef;
  anstallda: Anstalld[] = [];
  hot!: Handsontable;
  subscription!: Subscription;
  private radIdMap: string[] = [];
  skip = 0;
  limit = 100;
  totalAnstallda = 0;
  currentPage = 1;

  constructor(
    private anstalldService: AnstalldService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.hamtaAnstallda();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  hamtaAnstallda(): void {
    this.subscription = this.anstalldService.getAnstallda(this.skip, this.limit).subscribe({
      next: (response) => {
        console.log('🔥 Hämtade anställda:', response);
        this.anstallda = response.data;
        this.totalAnstallda = response.total;
        this.radIdMap = this.anstallda.map(a => a._id ?? '');
        this.initHandsontable();
      },
      error: (error) => console.error('❌ Fel vid hämtning:', error)
    });
  }

  initHandsontable(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = document.querySelector('.handsontable-container') as HTMLElement;
    if (this.hot) this.hot.destroy();

    this.hot = new Handsontable(container, {
      data: this.anstallda,
      columns: [
        { data: 'Fornamn', type: 'text', title: 'Förnamn' },
        { data: 'Efternamn', type: 'text', title: 'Efternamn' },
        { data: 'Personnummer', type: 'text', title: 'Personnummer' },
        { data: 'Roll', type: 'text', title: 'Roll' },
        { data: 'Chef', type: 'text', title: 'Chef' },
        { 
          data: 'Layout', type: 'dropdown', title: 'Layout', 
          source: ['Stockholmståg', 'SJ', 'Konsult'], 
          strict: true, allowInvalid: false 
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
      rowHeaders: true,
      filters: true,
      dropdownMenu: true,
      search: true,
      licenseKey: 'non-commercial-and-evaluation',
      contextMenu: {
        items: {
          'add_above': {
            name: '➕ Lägg till rad ovanför',
            callback: (_, selection) => this.laggTillNyAnstalld(selection[0].start.row)
          },
          'add_below': {
            name: '➕ Lägg till rad under',
            callback: (_, selection) => this.laggTillNyAnstalld(selection[0].start.row + 1)
          },
          'remove_row': {
            name: '🗑️ Ta bort rad',
            callback: (_, selection) => this.raderaAnstalld(selection[0].start.row)
          },
          '---------': {},
          'undo': {},
          'redo': {}
        }
      },
      afterChange: (changes, source) => {
        if (!changes || source === 'loadData') return;
        this.handleChanges(changes);
      }
    });
  }

  handleChanges(changes: any[]): void {
    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (oldValue !== newValue) {
        const anstalld = this.anstallda[row];
        if (prop.startsWith('Tjanstekort.')) {
          const tjanstekortProp = prop.split('.')[1];
          anstalld.Tjanstekort = { ...anstalld.Tjanstekort, [tjanstekortProp]: newValue };
        } else {
          (anstalld as any)[prop] = newValue;
        }
        this.sparaAnstalld(anstalld);
      }
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
      next: () => this.hamtaAnstallda(),
      error: (error) => console.error('❌ Fel vid skapande:', error)
    });
  }

  raderaAnstalld(radIndex: number): void {
    const id = this.radIdMap[radIndex];
    const anstalld = this.anstallda[radIndex];

    if (!id) return console.warn('⚠️ Kan inte radera: saknar _id');

    if (!confirm(`Är du säker på att du vill radera ${anstalld.Fornamn} ${anstalld.Efternamn}?`)) return;

    this.anstalldService.raderaAnstalld(id).subscribe({
      next: () => {
        this.anstallda.splice(radIndex, 1);
        this.radIdMap.splice(radIndex, 1);
        this.hot.loadData(this.anstallda);
      },
      error: (error) => console.error('❌ Fel vid radering:', error)
    });
  }

  sparaAnstalld(updatedAnstalld: Anstalld): void {
    if (updatedAnstalld._id) {
      this.anstalldService.uppdateraAnstalld(updatedAnstalld._id, updatedAnstalld).subscribe({
        next: () => console.log('✅ Anställd uppdaterad:', updatedAnstalld),
        error: (error) => console.error('❌ Fel vid uppdatering:', error)
      });
    }
  }

  // Navigering
  naxtaSida(): void {
    if (this.skip + this.limit < this.totalAnstallda) {
      this.skip += this.limit;
      this.currentPage++;
      this.hamtaAnstallda();
    }
  }

  forraSida(): void {
    if (this.skip - this.limit >= 0) {
      this.skip -= this.limit;
      this.currentPage--;
      this.hamtaAnstallda();
    }
  }

  // Sök i tabellen
  searchTable(event: any): void {
    const searchPlugin = this.hot.getPlugin('search');
    searchPlugin.query(event.target.value);
    this.hot.render();
  }
}
