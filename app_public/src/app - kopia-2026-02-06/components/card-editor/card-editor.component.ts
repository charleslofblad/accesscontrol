import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Canvas,
  IText,
  Rect,
  Image as FabricImageClass,
  FabricImage
} from 'fabric';
import { LayoutService, Layout } from '../../services/layout.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.css']
})
export class CardEditorComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  canvas!: Canvas;

  // För text‑redigering
  textInput = '';
  fontSize = 20;
  fontFamily = 'Arial';

  // För layouthantering
  layouts: Layout[] = [];
  selectedLayoutId = '';
  newLayoutName = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private layoutService: LayoutService,
    // 👇 injicera router och route
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initCanvas();
    this.loadAllLayouts();
  }

  //  NY METOD för att gå tillbaka till passerkort
backToPasserkort(): void {
  const personId = this.route.snapshot.paramMap.get('id'); // hämta ID från URL
  if (personId) {
    this.router.navigate(
      ['/passerkort', personId],
      { queryParams: this.route.snapshot.queryParams }
    );
  } else {
    this.router.navigate(
      ['/card-list'],
      { queryParams: this.route.snapshot.queryParams }
    );
  }
}




/** 1) Initiera canvas  version 3 */
private initCanvas() {
  const el = this.canvasRef.nativeElement as HTMLCanvasElement;

  // Sätt fysiska dimensioner på <canvas> för att undvika suddigt innehåll
  el.width  = 300;
  el.height = 500;

  // Initiera Fabric-canvas
  this.canvas = new Canvas(el, {
    width: 300,
    height: 500
  });
  this.canvas.backgroundColor = '#ffffff';
  this.canvas.calcOffset();
  this.canvas.requestRenderAll();

  // 1. Synka urval till text-redigeringsfält
  const syncSelection = (e: any) => {
    const obj = e.selected?.[0];
    if (obj instanceof IText) {
      this.textInput   = obj.text   || '';
      this.fontSize    = obj.fontSize  as number;
      this.fontFamily  = obj.fontFamily as string;
    }
  };
  this.canvas.on('selection:created', syncSelection);
  this.canvas.on('selection:updated', syncSelection);

  // 2. Gör canvas tabbable så att den kan få keydown-händelser
  this.canvas.upperCanvasEl.tabIndex = 0;

  // 3. Ta bort markerat objekt med Delete/Backspace,
  //    men bara när man inte är i ett input/textarea
  this.canvas.upperCanvasEl.addEventListener('keydown', (evt: KeyboardEvent) => {
    // Om fokus är i ett textfält, låt input-fältet hantera tangenterna
    const activeEl = document.activeElement;
    if (
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const activeObj = this.canvas.getActiveObject();
    if (!activeObj) {
      return;
    }

    if (evt.key === 'Delete' || evt.key === 'Backspace') {
      evt.preventDefault();  // förhindra browser-navigering
      this.deleteSelected();
    }
  });
}



  /** 2) Canvas‑verktyg */
  setBackgroundColor(e: Event) {
    this.canvas.backgroundColor = (e.target as HTMLInputElement).value;
    this.canvas.requestRenderAll();
  }

  addText() {
    const txt = new IText('Dubbelklicka för att redigera', {
      left:100, top:100,
      fontSize:this.fontSize,
      fontFamily:this.fontFamily,
      fill:'#000',
      editable:true
    });
    this.canvas.add(txt);
    this.canvas.setActiveObject(txt);
    this.canvas.requestRenderAll();
  }

  updateSelectedText() {
    const a = this.canvas.getActiveObject();
    if (a instanceof IText) {
      a.text = this.textInput;
      this.canvas.requestRenderAll();
    }
  }

  updateFont() {
    const a = this.canvas.getActiveObject();
    if (a instanceof IText) {
      a.fontSize   = this.fontSize;
      a.fontFamily = this.fontFamily;
      this.canvas.requestRenderAll();
    }
  }

  addRectangle() {
    this.canvas.add(new Rect({ left:50, top:50, width:100, height:50, fill:'red' }));
    this.canvas.requestRenderAll();
  }

  triggerImageUpload() {
    (document.getElementById('imageUpload') as HTMLInputElement).click();
  }

  onImageSelected(e: Event) {
    const f = (e.target as HTMLInputElement).files;
    if (!f?.length) return;
    const r = new FileReader();
    r.onload = ({ target }) => {
      FabricImageClass.fromURL(target!.result as string).then((img: FabricImage) => {
        img.set({ left:50, top:50, scaleX:0.3, scaleY:0.3, selectable:true });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.requestRenderAll();
      });
    };
    r.readAsDataURL(f[0]);
  }

  deleteSelected() {
    const a = this.canvas.getActiveObject();
    if (a) {
      this.canvas.remove(a);
      this.canvas.requestRenderAll();
    }
  }

  clearCanvas() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.calcOffset();
    this.canvas.requestRenderAll();
  }

  /** 3) Layout‑API‑koppling */
  loadAllLayouts() {
    this.layoutService.getLayouts().subscribe(ls => this.layouts = ls);
  }

  createLayout() {
    this.layoutService.createLayout(this.newLayoutName, this.canvas.toJSON())
      .subscribe(() => {
        this.newLayoutName = '';
        this.loadAllLayouts();
      });
  }

  applyLayout() {
    if (!this.selectedLayoutId) return;
    this.layoutService.getLayout(this.selectedLayoutId)
      .subscribe(layout => {
        this.canvas.loadFromJSON(layout.data, () => {
          this.canvas.calcOffset();
          this.canvas.requestRenderAll();
        });
      });
  }

  /** ← NY METOD för att spara ändrat layout */
  saveEditedLayout() {
    if (!this.selectedLayoutId) {
      alert('Välj först en layout att uppdatera.');
      return;
    }
  
    // Hitta objektet i listan för att få dess namn
    const layoutObj = this.layouts.find(l => l._id === this.selectedLayoutId);
    if (!layoutObj) {
      console.error('Layout hittades inte i listan');
      return;
    }
  
    const newData = this.canvas.toJSON();
    this.layoutService
      .updateLayout(this.selectedLayoutId, layoutObj.name, newData)
      .subscribe(() => alert('Layout uppdaterad i databasen!'));
  }
  
  /** 🖨️ NY METOD – Skriv ut aktuell layout */
  skrivUtLayout() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Kunde inte öppna utskriftsfönstret.');
      return;
    }

    // Hämta canvas-elementet
    const canvasEl = this.canvasRef.nativeElement as HTMLCanvasElement;
    const dataUrl = canvasEl.toDataURL('image/png');

    // Skriv ut layouten som bild
    printWindow.document.write(`
      <html>
        <head>
          <title>Skriv ut layout</title>
          <style>
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: #fff;
            }
            img {
              width: auto;
              height: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);

    printWindow.document.close();

    // Vänta lite innan utskrift så att bilden hinner laddas
    printWindow.onload = () => {
      printWindow.print();
    };
  }
// end

}
