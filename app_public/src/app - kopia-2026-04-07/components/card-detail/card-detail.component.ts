
/* 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  person: Anstalld | null = null;
  queryParams: any = {};
  editMode = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anstalldService: AnstalldService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    if (id) {
      this.anstalldService.getAnstalldById(id).subscribe({
        next: (res) => (this.person = res),
        error: (err) => console.error('Fel vid hämtning av person:', err)
      });
    }
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  save(): void {
    if (!this.person || !this.person._id) return;

    this.saving = true;
    this.anstalldService.uppdateraAnstalld(this.person._id, this.person).subscribe({
      next: (res) => {
        this.person = res;
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        console.error('Fel vid uppdatering:', err);
        this.saving = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/card-list'], { queryParams: this.queryParams });
  }
}

*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnstalldService } from '../../services/anstalld.service';
import { Anstalld } from '../../models/anstalld.model';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  person: Anstalld | null = null;
  queryParams: any = {};
  editMode = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anstalldService: AnstalldService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    if (id) {
      this.anstalldService.getAnstalldById(id).subscribe({
        next: (res) => (this.person = res),
        error: (err) => console.error('Fel vid hämtning av person:', err)
      });
    }
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  save(): void {
    if (!this.person || !this.person._id) return;

    this.saving = true;
    this.anstalldService.uppdateraAnstalld(this.person._id, this.person).subscribe({
      next: (res) => {
        this.person = res;
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        console.error('Fel vid uppdatering:', err);
        this.saving = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/card-list'], { queryParams: this.queryParams });
  }
  // denna funktion för att visa paserkort
  visaPasserkort(): void {
  if (!this.person?._id) return;

  this.router.navigate(['/passerkort', this.person._id], {
    queryParams: this.queryParams,
    state: { person: this.person } // 🔑 skicka hela objektet också
  });
}

  
}
