import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class FaceApiService {
  private isInitialized = false;

  async loadModels() {
    if (this.isInitialized) return;  // ✅ Säkerställer att det bara laddas en gång

    await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());

    if (tf.getBackend() !== 'wasm') {
      await tf.setBackend('wasm'); // ✅ Endast sätta backend om den inte redan är satt
    }

    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');

    this.isInitialized = true;
    console.log('Face-api.js modeller laddade!');
  }
  isModelsLoaded(): boolean {
    return this.isInitialized; // ✅ Fixar felet
  }
}
