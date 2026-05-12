// app_public\src\app\services\image-processing.service.ts
import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  async processImage(
    employeeImage: HTMLImageElement,
    visaOriginalBild: boolean
  ): Promise<HTMLImageElement | HTMLCanvasElement | null> {

    if (visaOriginalBild) {

      const maxWidth = 170;
      const maxHeight = 200;

      const scale = Math.min(
        maxWidth / employeeImage.width,
        maxHeight / employeeImage.height
      );

      const scaledWidth = employeeImage.width * scale;
      const scaledHeight = employeeImage.height * scale;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = maxWidth;
      tempCanvas.height = maxHeight;

      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(
        employeeImage,
        (maxWidth - scaledWidth) / 2,
        (maxHeight - scaledHeight) / 2,
        scaledWidth,
        scaledHeight
      );

      return tempCanvas;
    }

    // ================= FACE DETECTION =================

    const detections = await faceapi
      .detectSingleFace(employeeImage, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender();

    if (!detections) {
      alert("No face detected in the image. Try again with a different image.");
      return null;
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

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return null;

    const targetWidth = 150;
    const targetHeight = 200;

    croppedCanvas.width = targetWidth;
    croppedCanvas.height = targetHeight;

    const scale = Math.min(
      targetWidth / extendedBox.width,
      targetHeight / extendedBox.height
    );

    const scaledWidth = extendedBox.width * scale;
    const scaledHeight = extendedBox.height * scale;

    const offsetX = (targetWidth - scaledWidth) / 2;
    const offsetY = (targetHeight - scaledHeight) / 2;

    croppedCtx.drawImage(
      employeeImage,
      extendedBox.x,
      extendedBox.y,
      extendedBox.width,
      extendedBox.height,
      offsetX,
      offsetY,
      scaledWidth,
      scaledHeight
    );

    return croppedCanvas;
  }
}
