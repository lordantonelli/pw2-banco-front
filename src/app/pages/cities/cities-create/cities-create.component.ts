import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { City } from 'src/app/models/city.model';
import { State } from 'src/app/models/state.model';

import { StatesService } from '../../states/states.service';
import { CitiesService } from '../cities.service';

@Component({
  selector: 'app-cities-create',
  templateUrl: './cities-create.component.html',
  styleUrls: ['./cities-create.component.scss'],
})
export class CitiesCreateComponent implements OnInit {
  states: State[] = [];

  form: FormGroup = new FormGroup({});

  constructor(
    private readonly router: Router,
    private readonly citiesService: CitiesService,
    private readonly statesService: StatesService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.statesService.list().subscribe((resp) => {
      this.states = resp;
      this.states.sort((a: State, b: State) =>
        a.acronym.localeCompare(b.acronym)
      );
    });

    this.form = this.fb.group({
      name: [null, [Validators.required]],
      state: [null, [Validators.required]],
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const city: City = this.form.value;
      this.citiesService
        .create(city)
        .pipe(
          catchError((err) => {
            this.citiesService.showMessage(
              'Cidade não pode ser cadastrada!',
              true
            );
            return err;
          })
        )
        .subscribe((resp) => {
          this.citiesService.showMessage('Cidade cadastrada com sucesso!');
          this.router.navigate(['/cities']);
        });
    } else {
      this.citiesService.showMessage(
        'Há campos inválidos no formulário!',
        true
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/cities']);
  }
}
