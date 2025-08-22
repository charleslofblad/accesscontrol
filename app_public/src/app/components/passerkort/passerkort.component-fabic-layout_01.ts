


/*
PS C:\node_dev\accesscontrol> ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 19.1.5
Node: 20.17.0
Package Manager: npm 11.1.0
OS: win32 x64

Angular: undefined
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1901.5 (cli-only)
@angular-devkit/core         19.1.5 (cli-only)
@angular-devkit/schematics   19.1.5 (cli-only)
@schematics/angular          19.1.5 (cli-only)
*/
/*

Face-api.js fungerar bäst med TensorFlow.js v3.18.0. Så först avinstallera och 
installera om rätt versioner:

npm uninstall @tensorflow/tfjs face-api.js
npm install @tensorflow/tfjs@3.18.0 face-api.js@latest

Face-api.js senaste version (v0.22.2) fungerar ofta med TFJS 3.x. 
Men om du fortfarande får fel, testa att köra:

npm install face-api.js@0.22.0


*/



import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Anstalld } from '../../models/anstalld.model';
import { AnstalldService } from '../../services/anstalld.service';
import { LayoutService, Layout } from '../../services/layout.service';

import * as fabric from 'fabric';



import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';



// Kolla om vi är i webbläsaren innan vi importerar face-api.js
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
  visaOriginalBild: boolean = false; // <- Ny flagga
  detekteradAlder: number | null = null;//
  detekteratKon: string | null = null;//


  @ViewChild('idCardCanvas') idCardCanvas!: ElementRef;

 // constructor(private anstalldService: AnstalldService) {}

  constructor(
    private anstalldService: AnstalldService,
    private cdRef: ChangeDetectorRef,
    private layoutService: LayoutService // 🛠 LÄGG TILL DENNA
  ) {}





  async ngOnInit() {
    if (!isBrowser) {
      console.warn('face-api.js laddas inte i en icke-webbläsarmiljö.');
      return;
    }




// Tvinga användning av CPU istället för WebGL
//await tf.setBackend('cpu');// Ny
/* den gammla
await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());

    if (tf.getBackend() !== 'webgl') {
      await tf.setBackend('webgl'); //  Endast sätta backend om den inte redan är satt
    }
*/


    await tf.setBackend('cpu');  // 👈 Lägg till denna rad
    await tf.ready();


// END 

    //await tf.setBackend('webgl');
   // await tf.ready();

    try {
      console.log('Laddar modeller...');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/assets/models');// ny för ålder och kön


      this.faceDetectorLoaded = true;
      console.log('Modeller laddade.');
    } catch (error) {
      console.error('Fel vid laddning av modeller:', error);
    }
  }
// START
  toggleOriginalBild() {
    this.visaOriginalBild = !this.visaOriginalBild;
    this.ritaIdKort();
  }
//END

  ngAfterViewInit() {
    this.ritaIdKort();
  }

// Sök efter en anställd och uppdatera vald anställd 
  sokAnstalld(term: string) {
    console.log("Sökning påbörjad med termen:", term);
    this.anstalldService.sokAnstalld(term).subscribe((resultat) => {
      console.log("Sökresultat:", resultat);
  
      if (resultat.length > 0) {
        this.anstallda = resultat;
        this.valdIndex = 0;
  
        // Försök tvinga en vyuppdatering innan kortet ritas
        this.cdRef.detectChanges(); 
  
        setTimeout(() => {
          this.ritaIdKort(); // Rita kortet efter att vyn uppdaterats
        });
      } else {
        this.anstallda = [];
        this.valdIndex = -1;
  
        this.cdRef.detectChanges();
  
        setTimeout(() => {
          this.ritaIdKort();
        });
      }
    });
  }
  

  /** Getter för vald anställd */
  get valdAnstalld(): Anstalld | null {
    return this.anstallda.length > 0 && this.valdIndex >= 0 ? this.anstallda[this.valdIndex] : null;
  }

  /** Säker metod för att hantera `Tjanstekort` */
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

  /** Gå till nästa anställd */
  nextAnstalld() {
    if (this.valdIndex < this.anstallda.length - 1) {
      this.valdIndex++;
      this.ritaIdKort();
    }
  }

  /** Gå till föregående anställd */
  prevAnstalld() {
    if (this.valdIndex > 0) {
      this.valdIndex--;
      this.ritaIdKort();
    }
  }

  markAsChanged() {
    this.harAndringar = true;
  }

  /** 🛠 FIX: Ny metod för att spara eller skapa anställd */
  sparaAnstalld() {
    const anstalld = this.valdAnstalld;
    if (!anstalld) {
      console.error('❌ Ingen vald anställd att spara.');
      alert('Ingen vald anställd att spara.');
      return;
    }

    console.log('📤 Data som skickas till API:', JSON.stringify(anstalld, null, 2));

    if (anstalld._id) {
      // ✅ Uppdatera anställd
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
      // ✅ Skapa ny anställd
      this.anstalldService.skapaAnstalld(anstalld).subscribe({
        next: (response) => {
          console.log('✅ Ny anställd skapad:', response);
          if (this.valdAnstalld) {
            this.valdAnstalld._id = response._id; // 🛠 FIX: Se till att `_id` faktiskt uppdateras
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

    this.ritaIdKort(); // Uppdatera ID-kortet visuellt
  }

  /** Skapa ett nytt ID-kort med tomma fält */
  nyttIdKort() {
    const nyttKort: Anstalld = {
     // _id: '',
      Anstallda_ID: 0,
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
      //  _id: ''
      },
      BildURL: ''
    };

    this.anstallda = [nyttKort];
    this.valdIndex = 0;
    this.ritaIdKort();
  }


// Ersätt befintlig ritaIdKort med denna (och spara all annan kod som du hade oförändrad)
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
      const fabricCanvas = new fabric.StaticCanvas(canvas);

      this.layoutService.getLayoutByName(this.valdAnstalld.Layout).subscribe({
        next: (layout) => {
          console.log('✅ Layout hämtad från servern:', layout);

          fabricCanvas.loadFromJSON(layout.data, () => {
            console.log('🖼 Layout laddad i Fabric-canvas och renderad.');

            // ➡️ Testrektangel för att verifiera canvas-rendering
            const testRect = new fabric.Rect({
              left: 50,
              top: 50,
              width: 100,
              height: 100,
              fill: 'red'
            });
            fabricCanvas.add(testRect);

            fabricCanvas.renderAll();

            this.renderPhotoAndText(ctx, canvas);
          });
        },
        error: (error) => {
          console.error('❌ Fel vid hämtning av layout från servern:', error);
          this.renderPhotoAndText(ctx, canvas); // Fortsätt ändå
        }
      });
    } catch (error) {
      console.error('❗ Fel vid start av inläsning av layout:', error);
      this.renderPhotoAndText(ctx, canvas); // Fortsätt ändå
    }
  } else {
    console.warn('⚠️ Ingen Layout angiven, hoppar direkt till PhotoAndText');
    this.renderPhotoAndText(ctx, canvas);
  }
}




/*
private async renderLayoutAndIdCard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  console.log('▶️ renderLayoutAndIdCard startar...');

  if (this.valdAnstalld?.Layout) {
    console.log('🔎 Försöker hämta Layout från servern med ID/Namn:', this.valdAnstalld.Layout);
    try {
      const fabricCanvas = new fabric.StaticCanvas(canvas);

      this.layoutService.getLayoutByName(this.valdAnstalld.Layout).subscribe({
        next: (layout) => {
          console.log('✅ Layout hämtad från servern:', layout);

          fabricCanvas.loadFromJSON(layout.data, () => {
            console.log('🖼 Layout laddad i Fabric-canvas och renderad.');
            fabricCanvas.renderAll();

            this.renderPhotoAndText(ctx, canvas);
          });
        },
        error: (error) => {
          console.error('❌ Fel vid hämtning av layout från servern:', error);
          this.renderPhotoAndText(ctx, canvas); // Fortsätt ändå
        }
      });
    } catch (error) {
      console.error('❗ Fel vid start av inläsning av layout:', error);
      this.renderPhotoAndText(ctx, canvas); // Fortsätt ändå
    }
  } else {
    console.warn('⚠️ Ingen Layout angiven, hoppar direkt till PhotoAndText');
    this.renderPhotoAndText(ctx, canvas);
  }
}

*/


/*
private async renderLayoutAndIdCard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Om Layout är satt, rendera den först via Fabric.js
  if (this.valdAnstalld?.Layout) {
    try {
      const fabricCanvas = new fabric.StaticCanvas(canvas);

      // Ladda layout från JSON
      fabricCanvas.loadFromJSON(this.valdAnstalld.Layout, () => {
        fabricCanvas.renderAll();

        // När layouten är renderad, fortsätt med bild och text
        this.renderPhotoAndText(ctx, canvas);
      });
    } catch (error) {
      console.error('Fel vid inläsning av layout:', error);
      this.renderPhotoAndText(ctx, canvas); // Fortsätt ändå
    }
  } else {
    // Om ingen Layout finns, fortsätt direkt
    this.renderPhotoAndText(ctx, canvas);
  }
}
*/
private renderPhotoAndText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) { 
  const imageUrl = `http://localhost:8000/images/${this.valdAnstalld!.Personnummer}.jpg`;
  const employeeImage = new Image();
  employeeImage.crossOrigin = "Anonymous";
  employeeImage.src = imageUrl;

  employeeImage.onload = async () => {
    try {
      if (this.visaOriginalBild) {
        ctx.drawImage(employeeImage, 75, 50, 150, 200);
        // Logotyp borttagen
      } else {
        const detections = await faceapi
          .detectSingleFace(employeeImage, new faceapi.TinyFaceDetectorOptions())
          .withAgeAndGender();

        if (!detections) {
          alert("No face detected in the image. Try again with a different image.");
          return;
        }

        const { x, y, width, height } = detections.detection.box;
        this.detekteradAlder = Math.round(detections.age);
        this.detekteratKon = detections.gender;
        this.cdRef.detectChanges();

        const paddingWidth = 0.05;
        const paddingHeight = 0.40;
        const extendedBox = {
          x: Math.max(x - width * paddingWidth, 0),
          y: Math.max(y - height * paddingHeight, 0),
          width: Math.min(width * (1 + 2 * paddingWidth), employeeImage.width),
          height: Math.min(height * (1 + 2 * paddingHeight), employeeImage.height)
        };

        const targetWidth = 150;
        const targetHeight = 200;
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        if (!croppedCtx) return;

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

        ctx.drawImage(croppedCanvas, 75, 50, targetWidth, targetHeight);
        // Logotyp borttagen
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      alert("An error occurred during face detection. Check the console for more information.");
    }

    // Rita namn och efternamn ovanpå
    ctx.fillStyle = "#000000";
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.valdAnstalld!.Fornamn.toUpperCase(), canvas.width / 2, 430);
    ctx.fillText(this.valdAnstalld!.Efternamn.toUpperCase(), canvas.width / 2, 460);
  };

  employeeImage.onerror = () => {
    console.error("Kunde inte ladda bild:", imageUrl);
    // Logotyp borttagen

    ctx.fillStyle = "#000000";
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.valdAnstalld!.Fornamn.toUpperCase(), canvas.width / 2, 430);
    ctx.fillText(this.valdAnstalld!.Efternamn.toUpperCase(), canvas.width / 2, 460);
  };
}

  


  /** Hanterar utskrift av ID-kortet */
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
  
  filnamn: string = ''; // <-- Lägg till detta i din komponentklass

  // File upload handler
  valgtBildFile: File | null = null; // Ny variabel för valt bildfil

  // När användaren väljer en fil
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.valgtBildFile = input.files[0];
    }
  }
  
  // När användaren klickar på "Ladda upp"-knappen
  onUploadClick() {
    if (!this.valgtBildFile) {
      alert('Ingen fil har valts.');
      return;
    }
  
    this.uploadImage(this.valgtBildFile);
  }
  
  // Uppladdning till server
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file); // Filen får behålla sitt originalnamn
  
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
  

}
