import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import { LayoutService } from '../services/layout.service';
import { Anstalld } from '../models/anstalld.model';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class CardRenderService {

  private fabricCanvas: fabric.StaticCanvas | null = null;

  constructor(
    private layoutService: LayoutService,
    private imageProcessor: ImageProcessingService
  ) {}

  async initCanvas(canvasEl: HTMLCanvasElement): Promise<void> {

    if (this.fabricCanvas) {
      this.fabricCanvas.dispose();
      this.fabricCanvas = null;
    }

    this.fabricCanvas = new fabric.StaticCanvas(canvasEl, {
      backgroundColor: '#ffffff',
      selection: false
    });

    this.fabricCanvas.requestRenderAll();
  }

  async renderCard(
    canvasEl: HTMLCanvasElement,
    anstalld: Anstalld,
    visaOriginalBild: boolean
  ): Promise<void> {

    if (!canvasEl || !anstalld) return;

    await this.initCanvas(canvasEl);

    if (!this.fabricCanvas) return;

    if (anstalld.Layout) {

      this.layoutService.getLayoutByName(anstalld.Layout).subscribe({
        next: async (layout) => {

          this.fabricCanvas!.loadFromJSON(layout.data, () => {
            this.renderPhotoAndText(anstalld, visaOriginalBild);
          });

        },
        error: (err) => {
          console.error('Fel vid layout-hämtning:', err);
        }
      });

    } else {
      this.renderPhotoAndText(anstalld, visaOriginalBild);
    }
  }

  private async renderPhotoAndText(
    anstalld: Anstalld,
    visaOriginalBild: boolean
  ) {

    if (!this.fabricCanvas) return;

    const imageUrl = `http://localhost:8000/images/${anstalld.Personnummer}.jpg`;

    const employeeImage = new Image();
    employeeImage.crossOrigin = "Anonymous";
    employeeImage.src = imageUrl;

    employeeImage.onload = async () => {

      const processedImage = await this.imageProcessor.processImage(
        employeeImage,
        visaOriginalBild
      );

      if (!processedImage) return;

      const finalImage = new fabric.Image(processedImage, {
        left: 75,
        top: 50,
        selectable: false,
        evented: false
      });

      this.fabricCanvas!.add(finalImage);

      const centerX = this.fabricCanvas!.getWidth() / 2;

      const fornamnText = new fabric.Text(anstalld.Fornamn.toUpperCase(), {
        left: centerX,
        top: 400,
        fontSize: 25,
        fontFamily: 'Arial',
        fill: '#000000',
        textAlign: 'center',
        originX: 'center',
        selectable: false,
        evented: false
      });

      const efternamnText = new fabric.Text(anstalld.Efternamn.toUpperCase(), {
        left: centerX,
        top: 430,
        fontSize: 25,
        fontFamily: 'Arial',
        fill: '#000000',
        textAlign: 'center',
        originX: 'center',
        selectable: false,
        evented: false
      });

      const foretagText = new fabric.Text(
        (anstalld.Foretag || '').toUpperCase(),
        {
          left: centerX,
          top: 460,
          fontSize: 20,
          fontFamily: 'Arial',
          fill: '#fd0404',
          textAlign: 'center',
          originX: 'center',
          selectable: false,
          evented: false
        }
      );

      this.fabricCanvas!.add(fornamnText, efternamnText, foretagText);
      this.fabricCanvas!.renderAll();
    };

    employeeImage.onerror = () => {
      console.error("Kunde inte ladda bilden.");
    };
  }
}
