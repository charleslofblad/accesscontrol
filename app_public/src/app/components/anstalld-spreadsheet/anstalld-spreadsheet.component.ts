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
  private radIdMap: string[] = []; // 🆕 Mappar rader till deras _id

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
    this.subscription = this.anstalldService.getAnstallda().subscribe({
      next: (data) => {
        console.log('🔥 Hämtade anställda:', data);
        this.anstallda = data;
        this.radIdMap = data.map(a => a._id ?? ''); // 🆕 Spara ID separat
        this.initHandsontable();
      },
      error: (error) => console.error('Fel vid hämtning av anställda:', error)
    });
  }

  initHandsontable(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = document.querySelector('.handsontable-container') as HTMLElement;

    this.hot = new Handsontable(container, {
      data: this.anstallda,
      columns: [
     //   { data: 'Anstallda_ID', type: 'numeric', title: 'ID' },
        { data: 'Fornamn', type: 'text', title: 'Förnamn' },
        { data: 'Efternamn', type: 'text', title: 'Efternamn' },
        { data: 'Personnummer', type: 'text', title: 'Personnummer' },
        { data: 'Roll', type: 'text', title: 'Roll' },
        { data: 'Chef', type: 'text', title: 'Chef' },
      //  { data: 'Layout', type: 'text', title: 'Layout' },
      {
        data: 'Layout',
        type: 'dropdown',
        title: 'Layout',
        source: ['Stockholmståg', 'SJ', 'Konsult'],
        strict: true, // endast värden från listan tillåtna
        allowInvalid: false // hindra inmatning av ogiltigt värde
      },
      
        { data: 'Foretag', type: 'text', title: 'Företag' },
      //  { data: 'Tjanstekort.Tjanstekort_ID', type: 'numeric', title: 'Tjänstekort ID' },
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
              this.laggTillNyAnstalld(rowIndex); // Vi skickar in position
            }
          },
          'add_below': {
            name: '➕ Lägg till rad under',
            callback: (_, selection) => {
              const rowIndex = selection[0].start.row + 1;
              this.laggTillNyAnstalld(rowIndex); // Lägg efter
            }
          },
          'remove_row': {
            name: '🗑️ Ta bort rad',
            callback: (_, selection) => {
              const rowIndex = selection[0].start.row;
              this.raderaAnstalld(rowIndex);
            }
          },
          '---------': {}, // separator
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
