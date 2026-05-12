import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Anstalld } from '../../models/anstalld.model';
import { AnstalldService } from '../../services/anstalld.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeFacade } from '../../facades/employee.facade';
import { CardRenderService } from '../../services/card-render.service';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import * as fabric from 'fabric';

const isBrowser = typeof window !== 'undefined';

@Component({
  selector: 'app-passerkort',
  templateUrl: './passerkort.component.html',
  styleUrls: ['./passerkort.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PasserkortComponent implements OnInit, AfterViewInit {

pageNumbers$!: Observable<number[]>;
currentPage$!: Observable<number>;
employees$!: Observable<Anstalld[]>;
selectedIndex$!: Observable<number>;
selectedEmployee$!: Observable<Anstalld | null>;
sokTerm: string = '';
harAndringar: boolean = false;
loading: boolean = false;
error: string | null = null;
faceDetectorLoaded: boolean = false;
visaOriginalBild: boolean = false;
detekteradAlder: number | null = null;
detekteratKon: string | null = null;
fabricCanvas: fabric.StaticCanvas | null = null;
allaAnstallda: Anstalld[] = [];
sokResultat: Anstalld[] = [];
currentIndex = 0;
pageNumbers: number[] = [];
currentPage: number = 1;


  @ViewChild('idCardCanvas', { static: false }) idCardCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anstalldService: AnstalldService,
    private cdRef: ChangeDetectorRef,
    private cardRenderer: CardRenderService,
    public facade: EmployeeFacade,

  ) {}

get anstallda(): Anstalld[] {
  return this.facade.employees;
}

get valdIndex(): number {
  return this.facade.selectedIndex;
}

get valdAnstalld(): Anstalld | null {
  return this.facade.selectedEmployee;
}

async ngOnInit() {

  this.employees$ = this.facade.employees$;
  this.selectedIndex$ = this.facade.selectedIndex$;
  this.selectedEmployee$ = this.facade.selectedEmployee$;

this.selectedEmployee$.subscribe(emp => {
  if (emp) {
    setTimeout(() => this.tryRenderIdKort(), 0);
  }
});
  this.pageNumbers$ = this.employees$.pipe(
  map(list => Array.from({ length: list.length }, (_, i) => i + 1))
);

  this.currentPage$ = this.selectedIndex$.pipe(
  map(index => index + 1)
);

  const id = this.route.snapshot.paramMap.get('id');
  const nav = this.router.getCurrentNavigation();
  const statePerson = nav?.extras?.state?.['person'];


this.facade.loading$.subscribe(isLoading => {
  this.loading = isLoading;
});

this.facade.error$.subscribe(errMsg => {
  this.error = errMsg;
});

  if (statePerson) {
    console.log("👉 Person mottagen via state:", statePerson);
    this.facade.setEmployees([statePerson]);

  } else if (id) {
    console.log("👉 Hämtar person via ID:", id);
    this.anstalldService.getAnstalldById(id).subscribe({
      next: (res) => {
        this.facade.setEmployees([res]);
      },
      error: (err) => console.error('Fel vid hämtning av person:', err)
    });
  }

    if (!isBrowser) {
      console.warn('face-api.js laddas inte i en icke-webbläsarmiljö.');
      return;
    }

    await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());

    if (tf.getBackend() !== 'webgl') {
      await tf.setBackend('webgl');
    }

    try {
      console.log('Laddar modeller...');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/assets/models');

      this.faceDetectorLoaded = true;
      console.log('✅ Modeller laddade.');
      this.tryRenderIdKort();
    } catch (error) {
      console.error('Fel vid laddning av modeller:', error);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updatePagination();   //page
      this.tryRenderIdKort();
    }, 0);
  }

  private tryRenderIdKort(): void {
    if (!this.valdAnstalld) return;
    if (!this.idCardCanvas) return;
    if (!this.faceDetectorLoaded) return;

    console.log("🎯 Rendering ID-kort...");
    this.ritaIdKort();
  }

  toggleOriginalBild() {
    this.visaOriginalBild = !this.visaOriginalBild;
    this.ritaIdKort();
  }

  
  back(): void {
    this.router.navigate(['/card-list'], { queryParams: this.route.snapshot.queryParams });
  }

  redigeraLayout(): void {
  const personId = this.valdAnstalld?._id; // hämta aktuell persons ID
  if (personId) {
    this.router.navigate(
      ['/card-editor', personId],           // skicka ID som route-param
      { queryParams: this.route.snapshot.queryParams }
    );
  } else {
    this.router.navigate(['/card-editor']); // fallback
  }
}

sokAnstalld(term: string) {
  console.log("Sökning påbörjad med termen:", term);
  this.facade.searchEmployees(term);
}


  get valdTjanstekort() {
    return this.valdAnstalld?.Tjanstekort || {
      Tjanstekort_ID: null,
      Datum: null,
      EM_kod: null,
      Mifare_kod: null,
      Alliera_Bla: '',
      Alliera_Gron: '',
      RCO: null,
      _id: ''
    };
  }

nextAnstalld(): void {
  this.facade.next();
}

prevAnstalld(): void {
  this.facade.previous();
}

goToPage(page: number): void {
  this.facade.setSelectedIndex(page - 1);
}


markAsChanged() {
    this.harAndringar = true;
  }

sparaAnstalld() {
    const anstalld = this.valdAnstalld;
    if (!anstalld) {
      console.error('❌ Ingen vald anställd att spara.');
      alert('Ingen vald anställd att spara.');
      return;
    }

    console.log('📤 Data som skickas till API:', JSON.stringify(anstalld, null, 2));

    if (anstalld._id) {
      this.anstalldService.uppdateraAnstalld(anstalld._id, anstalld).subscribe({
        next: (response) => {
          console.log('✅ Uppdatering lyckades:', response);
          this.harAndringar = false;
          alert('Uppgifter sparade!');
        },
        error: (error) => {
          console.error('❌ Fel vid uppdatering:', error);
          alert('Kunde inte spara ändringarna.');
        }
      });
    } else {
      this.anstalldService.skapaAnstalld(anstalld).subscribe({
        next: (response) => {
          console.log('✅ Ny anställd skapad:', response);
          if (this.valdAnstalld) {
            this.valdAnstalld._id = response._id;
          }
          this.harAndringar = false;
          alert('Ny anställd skapad!');
        },
        error: (error) => {
          console.error('❌ Fel vid skapande:', error);
          alert('Kunde inte skapa den nya anställda.');
        }
      });
    }

    this.ritaIdKort();
  }

  nyttIdKort() {
    const nyttKort: Anstalld = {
     // Anstallda_ID: 0,
      FulltNamn: '',
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
        Datum: 0,
        EM_kod: 0,
        Mifare_kod: 0,
        Alliera_Bla: '',
        Alliera_Gron: '',
        RCO: 0,
      },
      BildURL: ''
    };

    this.facade.setEmployees([nyttKort]);
    this.updatePagination(); // Pagination

    this.ritaIdKort();
  }


  private async ritaIdKort() {

   if (!this.valdAnstalld || !this.idCardCanvas || !this.faceDetectorLoaded)
      return;

    await this.cardRenderer.renderCard(
      this.idCardCanvas.nativeElement,
      this.valdAnstalld,
      this.visaOriginalBild
   );
  }


  skrivUt() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Kunde inte öppna utskriftsfönstret.');
      return;
    }

    const canvas = this.idCardCanvas.nativeElement as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL();

    printWindow.document.write('<html><head><title>Print ID Card</title></head><body>');
    printWindow.document.write('<img src="' + dataUrl + '" style="width: 100%; height: auto;"/>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }

  filnamn: string = '';

  valgtBildFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.valgtBildFile = input.files[0];
    }
  }

  onUploadClick() {
    if (!this.valgtBildFile) {
      alert('Ingen fil har valts.');
      return;
    }

    this.uploadImage(this.valgtBildFile);
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8000/upload-image', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Image uploaded successfully:', data);
      alert('Bilden laddades upp framgångsrikt!');

      if (this.valdAnstalld) {
        this.valdAnstalld.BildURL = `http://localhost:8000/images/${data.filename}`;
        this.ritaIdKort();
      }
    })
    .catch(error => {
      console.error('Error uploading image:', error);
      alert('Kunde inte ladda upp bilden.');
    });
  }

  private updatePagination() {
  this.pageNumbers = Array.from(
    { length: this.anstallda.length },
    (_, i) => i + 1
  );
  this.currentPage = this.valdIndex + 1;
}
/*
goToPage(page: number) {
  this.facade.setSelectedIndex(page - 1);

  this.updatePagination();
  this.ritaIdKort();
}
*/

}
