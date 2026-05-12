import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
//import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';   // 👈 behövs för [(ngModel)]
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  anstallda: Anstalld[] = [];
  selectedPerson: Anstalld | null = null;
  selectedId: string | null = null;

  searchTerm: string = '';   // 👈 nytt för sökfältet
  skip = 0;
  limit = 10;
  total = 0;

  constructor(
  private anstalldService: AnstalldService,
  private route: ActivatedRoute   //
) {}


  ngOnInit(): void {
  this.route.queryParams.subscribe((params: any) => {
    this.searchTerm = params['search'] || '';
    this.skip = params['skip'] ? +params['skip'] : 0;
    this.limit = params['limit'] ? +params['limit'] : 10;
    this.hamtaAnstallda();
  });
}


  /** Hämtar anställda med eller utan sökterm */
  hamtaAnstallda(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      // Använd sökmetoden om sökterm finns
      this.anstalldService.sokAnstalldPaginerat(this.searchTerm, this.skip, this.limit).subscribe({
        next: (res) => {
          this.anstallda = res.anstallda;
          this.total = res.total;
        },
        error: (error) => console.error('Fel vid sökning av anställda:', error)
      });
    } else {
      // Annars hämta alla med paginering
      this.anstalldService.getAnstalldaPaginerat(this.skip, this.limit).subscribe({
        next: (res) => {
          this.anstallda = res.anstallda;
          this.total = res.total;
        },
        error: (error) => console.error('Fel vid hämtning av anställda:', error)
      });
    }
  }

  /** Körs när man söker */
  onSearch(): void {
    this.skip = 0;   // börja alltid om från första sidan
    this.hamtaAnstallda();
  }

  /** Gå till specifik sida */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.skip = (page - 1) * this.limit;
    this.hamtaAnstallda();
  }

  pagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  selectPerson(person: Anstalld): void {
    this.selectedPerson = person;
    this.selectedId = person._id ?? null;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  get currentPage(): number {
    return Math.floor(this.skip / this.limit) + 1;
  }

exportToWord(id?: string) {
  if (!id) {
    console.error('Ingen ID för export');
    return;
  }
  this.anstalldService.exportToWord(id).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ansokan_${id}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

}
