/*
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-converter',
  imports: [],
  templateUrl: './file-converter.component.html',
  styleUrl: './file-converter.component.css'
})
export class FileConverterComponent {

}

*/

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-converter',
  templateUrl: './file-converter.component.html'
})
export class FileConverterComponent {
  excelFile?: File;
  xmlFile?: File;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event, type: 'excel' | 'xml') {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      if (type === 'excel') this.excelFile = input.files[0];
      else this.xmlFile = input.files[0];
    }
  }

  convertExcelToXml(event: Event) {
    event.preventDefault();
    if (!this.excelFile) return;

    const formData = new FormData();
    formData.append('file', this.excelFile);

    this.http.post('http://localhost:8000/api/files/excel-to-xml', formData, { responseType: 'blob' })

  //  this.http.post('/api/files/excel-to-xml', formData, { responseType: 'blob' })
      .subscribe(blob => this.downloadFile(blob, 'data.xml'));
  }

  convertXmlToExcel(event: Event) {
    event.preventDefault();
    if (!this.xmlFile) return;

    const formData = new FormData();
    formData.append('file', this.xmlFile);


    this.http.post('http://localhost:8000/api/files/xml-to-excel', formData, { responseType: 'blob' })

 //   this.http.post('/api/files/xml-to-excel', formData, { responseType: 'blob' })
      .subscribe(blob => this.downloadFile(blob, 'data.xlsx'));
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
