// app_public\src\app\services\face-recognition.service.ts
import { Injectable } from '@angular/core';
//import * as faceapi from 'face-api.js';
let faceapi: any;
import { Anstalld } from '../models/anstalld.model';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {

  private employees: Anstalld[] = [];

async init() {
  if (!faceapi) {
    faceapi = await import('face-api.js');
  }
}


  setEmployees(employees: Anstalld[]) {
    this.employees = employees;
  }

  findBestMatch(descriptor: Float32Array): Anstalld | null {

  if (!faceapi) {
    console.warn('⛔ faceapi ej initierad');
    return null;
  }

  const labeled = this.employees
    .filter(e => e.faceDescriptors?.length)
    .map(e =>
      new faceapi.LabeledFaceDescriptors(
        e.Personnummer,
        e.faceDescriptors!.map(d => new Float32Array(d))
      )
    );

  if (!labeled.length) return null;

  const matcher = new faceapi.FaceMatcher(labeled, 0.5);
  const result = matcher.findBestMatch(descriptor);

  if (result.label === 'unknown') return null;

  return this.employees.find(e => e.Personnummer === result.label) || null;
}

  matchWithEmployee(descriptor: Float32Array, employee: Anstalld): boolean {

  if (!faceapi) {
    console.warn('⛔ faceapi ej initierad');
    return false;
  }

  if (!employee.faceDescriptors?.length) return false;

  return employee.faceDescriptors.some(saved => {
    const dist = faceapi.euclideanDistance(
      descriptor,
      new Float32Array(saved)
    );
    return dist < 0.45;
  });
}

  addDescriptor(employee: Anstalld, descriptor: Float32Array) {

  if (!employee.faceDescriptors) {
    employee.faceDescriptors = [];
  }

  // 👉 max 5 descriptors per person
  if (employee.faceDescriptors.length >= 5) {
    return;
  }

  employee.faceDescriptors.push(Array.from(descriptor));
}
/*
getDistance(descriptor: Float32Array, employee: Anstalld): number {

  if (!employee.faceDescriptors?.length) return 999;

  let minDistance = 1;

  for (const saved of employee.faceDescriptors) {
    const dist = faceapi.euclideanDistance(
      descriptor,
      new Float32Array(saved)
    );

    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return minDistance;
}
  */
getDistance(descriptor: Float32Array, employee: Anstalld): number {

  if (!employee.faceDescriptors?.length) return 999;

  const distances = employee.faceDescriptors.map(saved =>
    faceapi.euclideanDistance(
      descriptor,
      new Float32Array(saved)
    )
  );

  return Math.min(...distances);
}

getMeanDescriptor(employee: Anstalld): Float32Array | null {
  if (!employee.faceDescriptors || employee.faceDescriptors.length === 0) {
    return null;
  }

  const length = employee.faceDescriptors[0].length;
  const mean = new Float32Array(length);

  // Summera alla descriptors
  employee.faceDescriptors.forEach(desc => {
    for (let i = 0; i < length; i++) {
      mean[i] += desc[i];
    }
  });

  // Dividera med antal → medelvärde
  for (let i = 0; i < length; i++) {
    mean[i] /= employee.faceDescriptors.length;
  }

  return mean;
}



}