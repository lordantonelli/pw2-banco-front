import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss'],
})
export class CitiesListComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  navigateToCityCreate(): void {
    this.router.navigate(['/cities/create']);
  }
}
