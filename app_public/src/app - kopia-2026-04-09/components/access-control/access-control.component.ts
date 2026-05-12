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
import {
  Component, OnInit, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as faceapi from 'face-api.js';
import { AnstalldService } from '../../services/anstalld.service';
import { FaceRecognitionService } from '../../services/face-recognition.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule] // 🔥 DENNA ÄR LÖSNINGEN
})
export class AccessControlComponent implements OnInit {

  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;

  mifareInput: string = '';
  currentEmployee: Anstalld | null = null;
  accessStatus: string = '';

  constructor(
    private anstalldService: AnstalldService,
    private faceService: FaceRecognitionService
  ) {}

  async ngOnInit() {
    await this.loadModels();
    await this.startCamera();
    this.startDetection();
  }

  async loadModels() {
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

      if (!detection) return;

      this.handleFace(detection.descriptor);

    }, 600);
  }

  handleFace(descriptor: Float32Array) {

    // 🟢 FALL 1 – Kort scannat
    if (this.currentEmployee) {

      const match = this.faceService.matchWithEmployee(
        descriptor,
        this.currentEmployee
      );

      if (match) {
        this.accessStatus = '✅ Access Granted (Card + Face)';

        this.faceService.addDescriptor(this.currentEmployee, descriptor);

        if (this.currentEmployee._id) {
          this.anstalldService
            .uppdateraAnstalld(this.currentEmployee._id, this.currentEmployee)
            .subscribe();
        }

      } else {
        this.accessStatus = '❌ Face mismatch';
      }

      return;
    }

    // 🔵 FALL 2 – Face only
    const match = this.faceService.findBestMatch(descriptor);

    if (match) {
      this.accessStatus = '✅ Access Granted (Face Only)';
      this.currentEmployee = match;
    } else {
      this.accessStatus = '❌ Unknown person';
    }
  }

  onCardScanned() {

    this.anstalldService.getByMifare(this.mifareInput)
      .subscribe(emp => {
        this.currentEmployee = emp;
        this.accessStatus = 'Kort läst – verifierar ansikte...';

        this.faceService.setEmployees([emp]);
      });
  }
}