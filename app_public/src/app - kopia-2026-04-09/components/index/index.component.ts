/*
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  constructor(private router: Router) {}

  gotoCardList() {
    this.router.navigate(['/card-list']);
  }
}
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnstalldService } from '../../services/anstalld.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  totalPasserkort: number | null = null;  // <-- Här sparas totala antalet

  constructor(
    private router: Router,
    private anstalldService: AnstalldService
  ) {}

  ngOnInit(): void {
    this.hamtaTotaltAntalPasserkort();
  }

  gotoCardList() {
    this.router.navigate(['/card-list']);
  }

  /** Hämtar totalt antal anställda via API:t */
  hamtaTotaltAntalPasserkort(): void {
    this.anstalldService.getPagineradAnstallda(0, 1).subscribe({
      next: (res) => {
        this.totalPasserkort = res.total;
        console.log('Totalt antal passerkort:', res.total);
      },
      error: (err) => {
        console.error('Fel vid hämtning av totalt antal:', err);
      }
    });
  }
}
