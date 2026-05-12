/*
import { Component } from '@angular/core';

@Component({
  selector: 'app-access-control',
  imports: [],
  templateUrl: './access-control.component.html',
  styleUrl: './access-control.component.css'
})
export class AccessControlComponent {

}
*/

//accesscontrol\app_public\src\app\components\access-control\access-control.component.ts
import { AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import {
  Component, OnInit, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import * as faceapi from 'face-api.js';
let faceapi: any;
import { AnstalldService } from '../../services/anstalld.service';
import { FaceRecognitionService } from '../../services/face-recognition.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule] // 🔥 DENNA ÄR LÖSNINGEN
})
export class AccessControlComponent implements OnInit, AfterViewInit {

  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay', { static: true }) // ny
  overlayRef!: ElementRef<HTMLCanvasElement>;

  mifareInput: string = '';
  currentEmployee: Anstalld | null = null;
  accessStatus: string = '';
  isSaving = false;

  constructor(
    private anstalldService: AnstalldService,
    private faceService: FaceRecognitionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}




  
async ngOnInit() {

}

async ngAfterViewInit() {

  if (!isPlatformBrowser(this.platformId)) {
    console.warn('⛔ SSR – skippar kamera + face-api');
    return;
  }

  console.log('✅ Browser mode – startar AI');

  await this.faceService.init();
  await this.loadModels();
  await this.startCamera();
  this.startDetection();
}


async loadModels() {

  faceapi = await import('face-api.js');

  await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
}


  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoRef.nativeElement.srcObject = stream;
  }

startDetection() {
  setInterval(async () => {

    const detection = await faceapi
      .detectSingleFace(
        this.videoRef.nativeElement,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.log('❌ inget ansikte');
      return;
    }

    console.log('👁️ ansikte hittat');

    this.handleFace(detection.descriptor);

  }, 600);
}
/* fungerande kod
handleFace(descriptor: Float32Array) {

  if (!this.currentEmployee) {
    this.accessStatus = '🔍 Looking for card...';
    return;
  }

  const emp = this.currentEmployee;

  // 🧠 FALL 1: första ansiktet
  if (!emp.faceDescriptors || emp.faceDescriptors.length === 0) {

    console.log("🧠 Sparar första ansiktet...");

    this.faceService.addDescriptor(emp, descriptor);
    this.saveEmployee();

    this.accessStatus = '🧠 Ansikte registrerat (1/3)';
    return;
  }

  // 🎯 MATCHNING
  const distance = this.faceService.getDistance(descriptor, emp);
  console.log("🎯 Distance:", distance);

  if (distance < 0.45) {

    this.accessStatus = '✅ Access Granted';

    // ➕ Träna MEN throttla
    if (emp.faceDescriptors.length < 5 && !this.isSaving) {
      console.log("➕ Lägger till fler ansikten");

      this.faceService.addDescriptor(emp, descriptor);
      this.saveEmployee();
    }

  } else {
    this.accessStatus = '❌ Face mismatch';
  }
}
*/
handleFace(descriptor: Float32Array) {

  if (this.currentEmployee) {

    // 🧠 FALL 1: INGA ansikten sparade → LÄR SYSTEMET
    if (!this.currentEmployee.faceDescriptors || this.currentEmployee.faceDescriptors.length === 0) {

      console.log("🧠 Sparar första ansiktet...");

      this.faceService.addDescriptor(this.currentEmployee, descriptor);

      this.saveEmployee();

      this.accessStatus = '🧠 Ansikte registrerat (1/3)';
      return;
    }

    // 🟢 NY LOGIK: använd mean descriptor
    const mean = this.faceService.getMeanDescriptor(this.currentEmployee);

    if (!mean) {
      console.log("⚠️ Ingen face-profil ännu");
      return;
    }

    const distance = faceapi.euclideanDistance(descriptor, mean);

    console.log("📏 Distance (mean):", distance);
 // if (distance < 0.45) {
    if (distance < 0.50) {



    if (distance < 0.42) {
  // säker match
        this.accessStatus = '✅ Access Granted';
      }
      else if (distance < 0.50) {
  // osäker match
        this.accessStatus = '⚠️ Uncertain - retry';
      }
      else {
        this.accessStatus = '❌ Face mismatch';
      }

     // this.accessStatus = '✅ Access Granted';

      // 🔁 Fortsätt träna
      if (this.currentEmployee.faceDescriptors.length < 5) {
        this.faceService.addDescriptor(this.currentEmployee, descriptor);
        this.saveEmployee();
        console.log("➕ Lägger till fler ansikten");
      }

    } else {
      this.accessStatus = '❌ Face mismatch';
    }

    return;
  }

  this.accessStatus = '🔍 Looking for face...';
}

  onCardScanned() {

  console.log('🔥 Scan knapp tryckt', this.mifareInput);

  this.anstalldService.getByMifare(this.mifareInput)
    .subscribe(emp => {
      console.log('✅ Employee hittad:', emp);

      this.currentEmployee = emp;
      this.accessStatus = 'Kort läst – verifierar ansikte...';

      this.faceService.setEmployees([emp]);
    });
}

  
  drawBox(detection: any, ctx: CanvasRenderingContext2D) {

  const { x, y, width, height } = detection.detection.box;

  // 🔲 Rita box
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // 📊 Confidence
  const score = detection.detection.score;

  ctx.fillStyle = '#00ff00';
  ctx.font = '14px Arial';
  ctx.fillText(`Confidence: ${score.toFixed(2)}`, x, y - 5);
}


saveEmployee() {
  if (this.isSaving || !this.currentEmployee?._id) return;

  this.isSaving = true;

  this.anstalldService.uppdateraAnstalld(
    this.currentEmployee._id,
    { faceDescriptors: this.currentEmployee.faceDescriptors || [] }
  ).subscribe({
    next: () => {
      console.log('💾 Sparad i DB');
      this.isSaving = false; // 🔥 viktigt
    },
    error: err => {
      console.error('❌ Fel vid sparning', err);
      this.isSaving = false; // 🔥 viktigt
    }
  });
}


}