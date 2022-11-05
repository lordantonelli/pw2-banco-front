import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { City } from './../../../models/city.model';

@Component({
  selector: 'app-cities-delete',
  templateUrl: './cities-delete.component.html',
  styleUrls: ['./cities-delete.component.scss'],
})
export class CitiesDeleteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: City) {}

  ngOnInit(): void {}
}
