import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';
import Handsontable from 'handsontable';
import { Subscription } from 'rxjs';
import 'handsontable/dist/handsontable.full.min.css';
import 'handsontable/styles/ht-theme-main.css';
//import 'handsontable/styles/ht-theme-main-dark.css';


import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-anstalld-spreadsheet-paginated',
  templateUrl: './anstalld-spreadsheet-paginated.component.html',
  styleUrls: ['./anstalld-spreadsheet-paginated.component.css']
})
export class AnstalldSpreadsheetPaginatedComponent implements OnInit, OnDestroy {
  @ViewChild('handsontableContainer', { static: false }) containerRef!: ElementRef;
  anstallda: Anstalld[] = [];
  hot!: Handsontable;
  subscription!: Subscription;
  private radIdMap: string[] = [];
  public skip = 0;
  private limit = 5;
  private total = 0;

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
/* första versionen
  hamtaAnstallda(): void {
    this.subscription = this.anstalldService.getPagineradAnstallda(this.skip, this.limit).subscribe({
      next: (res) => {
        this.anstallda = res.anstallda;
        this.total = res.total;
        this.radIdMap = this.anstallda.map(a => a._id ?? '');
        this.initHandsontable();
      },
      error: (error) => console.error('Fel vid hämtning av anställda:', error)
    });
  }
*/

hamtaAnstallda(): void {
  this.subscription = this.anstalldService.getPagineradAnstallda(this.skip, this.limit).subscribe({
    next: (res) => {
      this.anstallda = res.anstallda;
      this.total = res.total;
      this.radIdMap = this.anstallda.map(a => a._id ?? '');

      if (this.hot) {
        // Bara uppdatera datan
        this.hot.loadData(this.anstallda);
      } else {
        // Initiera bara om hot inte redan finns
        this.initHandsontable();
      }
    },
    error: (error) => console.error('Fel vid hämtning av anställda:', error)
  });
}


//naxta(): void {
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

initHandsontable(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  if (this.hot) return; // ⚠️ Viktigt! Initiera bara en gång

  const container = document.querySelector('.handsontable-container') as HTMLElement;

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
    rowHeaders: (index) => (this.skip + index + 1).toString(),

    filters: true,
    dropdownMenu: true,
    search: true,
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: {
      items: {
        'add_above': {
          name: '➕ Lägg till rad ovanför',
          callback: (_, selection) => {
            const rowIndex = selection[0].start.row;
            this.laggTillNyAnstalld(rowIndex);
          }
        },
        'add_below': {
          name: '➕ Lägg till rad under',
          callback: (_, selection) => {
            const rowIndex = selection[0].start.row + 1;
            this.laggTillNyAnstalld(rowIndex);
          }
        },
        'remove_row': {
          name: '🗑️ Ta bort rad',
          callback: (_, selection) => {
            const rowIndex = selection[0].start.row;
            this.raderaAnstalld(rowIndex);
          }
        },
        'radera_markerad': {
          name: '🗑️ Ta bort markerad rad',
          callback: () => {
            this.raderaMarkeradRad();
          }
        },
        '---------': {},
        'undo': {},
        'redo': {},
      }
    },
    afterChange: (changes, source) => {
      if (!changes || source === 'loadData') return;
      this.handleChanges(changes, source);
    }
  });
}



  searchTable(event: any) {
    const searchPlugin = this.hot.getPlugin('search');
    searchPlugin.query(event.target.value);
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
        console.log('🗑️ Anställd raderad:', anstalld);
        this.anstallda.splice(radIndex, 1);
        this.radIdMap.splice(radIndex, 1);
        this.hot.loadData(this.anstallda);
      },
      error: (error) => console.error('❌ Fel vid radering:', error)
    });
  }

  handleChanges(changes: any[], source: string): void {
    if (source === 'edit' && changes) {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (oldValue !== newValue) {
          const anstalld = this.anstallda[row];
          if (prop.startsWith('Tjanstekort.')) {
            const tjanstekortProp = prop.split('.')[1];
            const updatedTjanstekort = {
              ...anstalld.Tjanstekort,
              [tjanstekortProp]: newValue
            };
            const updatedAnstalld = { ...anstalld, Tjanstekort: updatedTjanstekort };
            this.sparaAnstalld(updatedAnstalld as Anstalld);
          } else {
            const updatedAnstalld = { ...anstalld, [prop]: newValue };
            this.sparaAnstalld(updatedAnstalld as Anstalld);
          }
        }
      });
    }
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
      next: (skapad) => {
        console.log('🆕 Ny anställd skapad:', skapad);

        if (typeof insertionIndex === 'number') {
          this.anstallda.splice(insertionIndex, 0, skapad);
        } else {
          this.anstallda.push(skapad);
        }

        this.hot.loadData(this.anstallda);
      },
      error: (error) => {
        console.error('❌ Fel vid skapande av anställd:', error);
      }
    });
  }

  sparaAnstalld(updatedAnstalld: Anstalld): void {
    if (updatedAnstalld._id) {
      this.anstalldService.uppdateraAnstalld(updatedAnstalld._id, updatedAnstalld).subscribe({
        next: () => console.log('✅ Anställd uppdaterad:', updatedAnstalld),
        error: (error) => console.error('❌ Fel vid uppdatering:', error)
      });
    } else {
      console.warn('⚠️ Kan inte uppdatera – saknar _id på anställd:', updatedAnstalld);
    }
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


/*
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';
import Handsontable from 'handsontable';
import { Subscription } from 'rxjs';
import 'handsontable/dist/handsontable.full.min.css';
import 'handsontable/styles/ht-theme-main.css';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-anstalld-spreadsheet-paginated',
  templateUrl: './anstalld-spreadsheet-paginated.component.html',
  styleUrls: ['./anstalld-spreadsheet-paginated.component.css']
})
export class AnstalldSpreadsheetPaginatedComponent implements OnInit, OnDestroy {
  @ViewChild('handsontableContainer', { static: false }) containerRef!: ElementRef;
  anstallda: Anstalld[] = [];
  hot!: Handsontable;
  subscription!: Subscription;
  private radIdMap: string[] = [];
  public skip = 0;
  private limit = 3;
  private total = 0;

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
    this.subscription = this.anstalldService.getPagineradAnstallda(this.skip, this.limit).subscribe({
      next: (res) => {
        this.anstallda = res.anstallda;
        this.total = res.total;
        this.radIdMap = this.anstallda.map(a => a._id ?? '');
        this.initHandsontable();
      },
      error: (error) => console.error('Fel vid hämtning av anställda:', error)
    });
  }

  naxta(): void {
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

  initHandsontable(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = document.querySelector('.handsontable-container') as HTMLElement;

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
          title: 'Layout',
          source: ['Stockholmståg', 'SJ', 'Konsult'],
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
      rowHeaders: true,
      filters: true,
      dropdownMenu: true,
      search: true,
      licenseKey: 'non-commercial-and-evaluation',
      contextMenu: {
        items: {
          'add_above': {
            name: '➕ Lägg till rad ovanför',
            callback: (_, selection) => {
              const rowIndex = selection[0].start.row;
              this.laggTillNyAnstalld(rowIndex);
            }
          },
          'add_below': {
            name: '➕ Lägg till rad under',
            callback: (_, selection) => {
              const rowIndex = selection[0].start.row + 1;
              this.laggTillNyAnstalld(rowIndex);
            }
          },
          'remove_row': {
            name: '🗑️ Ta bort rad',
            callback: (_, selection) => {
              const rowIndex = selection[0].start.row;
              this.raderaAnstalld(rowIndex);
            }
          },
          '---------': {},
          'undo': {},
          'redo': {},
        }
      },
      afterChange: (changes, source) => {
        if (!changes || source === 'loadData') return;
        this.handleChanges(changes, source);
      }
    });
  }

  searchTable(event: any) {
    const searchPlugin = this.hot.getPlugin('search');
    searchPlugin.query(event.target.value);
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
        console.log('🗑️ Anställd raderad:', anstalld);
        this.anstallda.splice(radIndex, 1);
        this.radIdMap.splice(radIndex, 1);
        this.hot.loadData(this.anstallda);
      },
      error: (error) => console.error('❌ Fel vid radering:', error)
    });
  }

  handleChanges(changes: any[], source: string): void {
    if (source === 'edit' && changes) {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (oldValue !== newValue) {
          const anstalld = this.anstallda[row];
          if (prop.startsWith('Tjanstekort.')) {
            const tjanstekortProp = prop.split('.')[1];
            const updatedTjanstekort = {
              ...anstalld.Tjanstekort,
              [tjanstekortProp]: newValue
            };
            const updatedAnstalld = { ...anstalld, Tjanstekort: updatedTjanstekort };
            this.sparaAnstalld(updatedAnstalld as Anstalld);
          } else {
            const updatedAnstalld = { ...anstalld, [prop]: newValue };
            this.sparaAnstalld(updatedAnstalld as Anstalld);
          }
        }
      });
    }
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
      next: (skapad) => {
        console.log('🆕 Ny anställd skapad:', skapad);
  
        if (typeof insertionIndex === 'number') {
          this.anstallda.splice(insertionIndex, 0, skapad);
        } else {
          this.anstallda.push(skapad);
        }
  
        this.hot.loadData(this.anstallda);
      },
      error: (error) => {
        console.error('❌ Fel vid skapande av anställd:', error);
      }
    });
  }
  

  sparaAnstalld(updatedAnstalld: Anstalld): void {
    if (updatedAnstalld._id) {
      this.anstalldService.uppdateraAnstalld(updatedAnstalld._id, updatedAnstalld).subscribe({
        next: () => console.log('✅ Anställd uppdaterad:', updatedAnstalld),
        error: (error) => console.error('❌ Fel vid uppdatering:', error)
      });
    } else {
      console.warn('⚠️ Kan inte uppdatera – saknar _id på anställd:', updatedAnstalld);
    }
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
*/


