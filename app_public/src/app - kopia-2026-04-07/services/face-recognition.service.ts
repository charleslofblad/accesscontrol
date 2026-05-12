// app_public\src\app\services\face-recognition.service.ts
import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { Anstalld } from '../models/anstalld.model';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {

  private employees: Anstalld[] = [];

  setEmployees(employees: Anstalld[]) {
    this.employees = employees;
  }

  findBestMatch(descriptor: Float32Array): Anstalld | null {

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

    employee.faceDescriptors.push(Array.from(descriptor));
  }
}