import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  anstallda: Anstalld[] = [];
  selectedPerson: Anstalld | null = null;
  selectedId: string | null = null;

  skip = 0;
  limit = 10;   // antal poster per sida
  total = 0;

  constructor(private anstalldService: AnstalldService) {}

  ngOnInit(): void {
    this.hamtaAnstallda();
  }

  hamtaAnstallda(): void {
    this.anstalldService.getPagineradAnstallda(this.skip, this.limit).subscribe({
      next: (res) => {
        this.anstallda = res.anstallda;
        this.total = res.total;
      },
      error: (error) => console.error('Fel vid hämtning av anställda:', error)
    });
  }

  nasta(): void {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.hamtaAnstallda();
    }
  }

  tillbaka(): void {
    if (this.skip - this.limit >= 0) {
      this.skip -= this.limit;
      this.hamtaAnstallda();
    }
  }

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
}
