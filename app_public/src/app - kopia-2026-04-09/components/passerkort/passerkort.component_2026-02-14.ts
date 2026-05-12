import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Anstalld } from '../../models/anstalld.model';
import { AnstalldService } from '../../services/anstalld.service';
import { LayoutService } from '../../services/layout.service';

//import { ImageProcessingService } from '../../services/image-processing.service';
import { ImageProcessingService } from '../../services/image-processing.service';


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
  sokTerm: string = '';
  anstallda: Anstalld[] = [];
  valdIndex: number = 0;
  harAndringar: boolean = false;
  faceDetectorLoaded: boolean = false;
  visaOriginalBild: boolean = false;
  detekteradAlder: number | null = null;
  detekteratKon: string | null = null;
  fabricCanvas: fabric.StaticCanvas | null = null;
  
//start
  allaAnstallda: Anstalld[] = [];
  sokResultat: Anstalld[] = [];

  currentIndex = 0;
// end

  
  // PAGINATION
  pageNumbers: number[] = [];
  currentPage: number = 1;

  @ViewChild('idCardCanvas', { static: false }) idCardCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anstalldService: AnstalldService,
    private layoutService: LayoutService,
    private cdRef: ChangeDetectorRef,//
    private imageProcessor: ImageProcessingService// test av service
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const nav = this.router.getCurrentNavigation();
    const statePerson = nav?.extras?.state?.['person'];

    if (statePerson) {
      console.log("👉 Person mottagen via state:", statePerson);
      this.anstallda = [statePerson];
      this.valdIndex = 0;
      this.updatePagination();   //xxxxxxxxxxx
      this.cdRef.detectChanges();
      this.tryRenderIdKort();
    } else if (id) {
      console.log("👉 Hämtar person via ID:", id);
      this.anstalldService.getAnstalldById(id).subscribe({
        next: (res) => {
          this.anstallda = [res];
          this.valdIndex = 0;
          this.updatePagination();   //xxxxxxxxxxxx
          this.cdRef.detectChanges();
          this.tryRenderIdKort();
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
/*
  ngAfterViewInit(): void {
    // När canvas finns – försök rita
    setTimeout(() => this.tryRenderIdKort(), 0);
  }
*/
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updatePagination();   //page
      this.tryRenderIdKort();
    }, 0);
  }
  /** Kör rendering bara om vi har allt som behövs */
  private tryRenderIdKort(): void {
    if (this.valdAnstalld && this.idCardCanvas && this.faceDetectorLoaded) {
      this.ritaIdKort();
    } else {
      console.log("⏳ Väntar på att allt ska laddas innan rendering...");
    }
  }

  private async initCanvas(canvasEl: HTMLCanvasElement): Promise<void> {
    if (!canvasEl) {
      console.error('❗ Canvas-elementet är inte tillgängligt.');
      return;
    }

    if (this.fabricCanvas) {
      console.warn('⚠️ Disposar befintlig fabricCanvas...');
      this.fabricCanvas.dispose();
      this.fabricCanvas = null;
    }

    console.log('✅ Initierar ny Fabric.StaticCanvas');
    this.fabricCanvas = new fabric.StaticCanvas(canvasEl, {
      backgroundColor: '#ffffff',
      selection: false
    });

    this.fabricCanvas.requestRenderAll();
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

 this.anstalldService
  .sokAnstalldPaginerat(term, 0, 500)
  .subscribe((res: any) => {

    this.anstallda = res.anstallda || [];
    this.valdIndex = this.anstallda.length ? 0 : -1;

    this.updatePagination();
    this.cdRef.detectChanges();
    this.tryRenderIdKort();
});
}

  get valdAnstalld(): Anstalld | null {
    return this.anstallda.length > 0 && this.valdIndex >= 0 ? this.anstallda[this.valdIndex] : null;
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

  nextAnstalld() {
    if (this.valdIndex < this.anstallda.length - 1) {
      this.valdIndex++;
      this.updatePagination(); // Pagination
      this.ritaIdKort();
    }
  }

  prevAnstalld() {
    if (this.valdIndex > 0) {
      this.valdIndex--;
      this.updatePagination();// Pagination
      this.ritaIdKort();
    }
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

    this.anstallda = [nyttKort];
    this.valdIndex = 0;
    this.updatePagination(); // Pagination

    this.ritaIdKort();
  }

  private async ritaIdKort() {
    if (!this.valdAnstalld || !this.idCardCanvas || !this.faceDetectorLoaded) return;

    const canvas = this.idCardCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await this.renderLayoutAndIdCard(canvas, ctx);
  }

  private async renderLayoutAndIdCard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    console.log('▶️ renderLayoutAndIdCard startar...');

    if (this.valdAnstalld?.Layout) {
      console.log('🔎 Försöker hämta Layout från servern med ID/Namn:', this.valdAnstalld.Layout);
      try {
        await this.initCanvas(canvas);

        if (!this.fabricCanvas) {
          console.error('❗ Fabric canvas är inte korrekt initierad.');
          return;
        }

        this.layoutService.getLayoutByName(this.valdAnstalld.Layout).subscribe({
          next: async (layout) => {
            console.log('✅ Layout hämtad från servern:', layout);

            this.fabricCanvas!.loadFromJSON(layout.data, () => {
              console.log('🖼 Layout laddad i Fabric-canvas och renderad.');

              // När layouten är renderad, lägg till personbild och text som Fabric-objekt
              this.renderPhotoAndTextFabric();
            });
          },
          error: (error) => {
            console.error('❌ Fel vid hämtning av layout från servern:', error);
          }
        });
      } catch (error) {
        console.error('❗ Fel vid start av inläsning av layout:', error);
      }
    } else {
      console.warn('⚠️ Ingen Layout angiven, hoppar direkt till PhotoAndText');
      this.renderPhotoAndTextFabric();
    }
  }



//-------------------------------------------------
  
  private async renderPhotoAndTextFabric() {
    if (!this.valdAnstalld || !this.fabricCanvas) {
      console.error('Ingen vald anställd eller Fabric canvas saknas.');
      return;
    }

    const imageUrl = `http://localhost:8000/images/${this.valdAnstalld.Personnummer}.jpg`;
    const employeeImage = new Image();
    employeeImage.crossOrigin = "Anonymous";
    employeeImage.src = imageUrl;

    employeeImage.onload = async () => {
      try {
        let finalImage: fabric.Image | null = null;
/*
        if (this.visaOriginalBild) {
          // Rita bilden direkt utan face detection
          finalImage = new fabric.Image(employeeImage, {
            left: 75,
            top: 50,
            width: 150,
            height: 200,
            selectable: false,
            evented: false
          });
          */
          if (this.visaOriginalBild) {
            // Skapa en fabric.Image och skala proportionellt så att den passar inom 150x200
            const maxWidth = 170;
            const maxHeight = 200;
            const scale = Math.min(maxWidth / employeeImage.width, maxHeight / employeeImage.height);
            const scaledWidth = employeeImage.width * scale;
            const scaledHeight = employeeImage.height * scale;
          
            finalImage = new fabric.Image(employeeImage, {
              left: 75 + (maxWidth - scaledWidth) / 2, // Centrerad inom 150x200-ramen
              top: 50 + (maxHeight - scaledHeight) / 2,
              scaleX: scale,
              scaleY: scale,
              selectable: false,
              evented: false
            });
            
        } else {
          console.log("Attempting to detect face...");
          const detections = await faceapi
            .detectSingleFace(employeeImage, new faceapi.TinyFaceDetectorOptions())
            .withAgeAndGender();

          if (!detections) {
            alert("No face detected in the image. Try again with a different image.");
            return;
          }

          console.log("Face detected:", detections);
          const { x, y, width, height } = detections.detection.box;

          const paddingWidth = 0.05;
          const paddingHeight = 0.40;
          const extendedBox = {
            x: Math.max(x - width * paddingWidth, 0),
            y: Math.max(y - height * paddingHeight, 0),
            width: Math.min(width * (1 + 2 * paddingWidth), employeeImage.width),
            height: Math.min(height * (1 + 2 * paddingHeight), employeeImage.height)
          };

          // Skapa ett temporärt canvas för att beskära bilden
          const croppedCanvas = document.createElement('canvas');
          const croppedCtx = croppedCanvas.getContext('2d');
          if (!croppedCtx) return;

          const targetWidth = 150;
          const targetHeight = 200;

          croppedCanvas.width = targetWidth;
          croppedCanvas.height = targetHeight;

          const scale = Math.min(targetWidth / extendedBox.width, targetHeight / extendedBox.height);
          const scaledWidth = extendedBox.width * scale;
          const scaledHeight = extendedBox.height * scale;
          const offsetX = (targetWidth - scaledWidth) / 2;
          const offsetY = (targetHeight - scaledHeight) / 2;

          croppedCtx.drawImage(
            employeeImage,
            extendedBox.x, extendedBox.y, extendedBox.width, extendedBox.height,
            offsetX, offsetY, scaledWidth, scaledHeight
          );

          // Skapa Fabric-bild från det beskurna canvaset
          finalImage = new fabric.Image(croppedCanvas, {
            left: 75,
            top: 50,
            width: targetWidth,
            height: targetHeight,
            selectable: false,
            evented: false
          });
        }

        if (finalImage) {
          this.fabricCanvas!.add(finalImage);
        }

//-------------------------------------------------


        // Lägg till text med namn (förnamn + efternamn)
        const fornamnText = new fabric.Text(this.valdAnstalld!.Fornamn.toUpperCase(), {
          left: this.fabricCanvas!.getWidth() / 2,
          top: 400,
          fontSize: 25,
          fontFamily: 'Arial',
          fill: '#000000',
          textAlign: 'center',
          originX: 'center',
          selectable: false,
          evented: false
        });

        const efternamnText = new fabric.Text(this.valdAnstalld!.Efternamn.toUpperCase(), {
          left: this.fabricCanvas!.getWidth() / 2,
          top: 430,
          fontSize: 25,
          fontFamily: 'Arial',
          fill: '#000000',
          textAlign: 'center',
          originX: 'center',
          selectable: false,
          evented: false
        });

        // Ny rad: Företag (om det finns)
        const foretagText = new fabric.Text((this.valdAnstalld!.Foretag || '').toUpperCase(), {
          left: this.fabricCanvas!.getWidth() / 2,
          top: 460,
          fontSize: 20,
          fontFamily: 'Arial',
          fill: '#fd0404',
          textAlign: 'center',
          originX: 'center',
          selectable: false,
          evented: false
        });

      //  this.fabricCanvas!.add(fornamnText, efternamnText);
        this.fabricCanvas!.add(fornamnText, efternamnText, foretagText);
        this.fabricCanvas!.renderAll();

      } catch (error) {
        console.error("Error during face detection or rendering:", error);
        alert("An error occurred during face detection or rendering. Check the console for more information.");
      }
    };

    employeeImage.onerror = () => {
      console.error("Kunde inte ladda bilden.");
    };
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

goToPage(page: number) {
  this.valdIndex = page - 1;
  this.updatePagination();
  this.ritaIdKort();
}


}
