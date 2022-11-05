import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { City } from 'src/app/models/city.model';
import { State } from 'src/app/models/state.model';

import { StatesService } from '../../states/states.service';
import { CitiesService } from '../cities.service';

@Component({
  selector: 'app-cities-edit',
  templateUrl: './cities-edit.component.html',
  styleUrls: ['./cities-edit.component.scss'],
})
export class CitiesEditComponent implements OnInit {
  id!: number;
  states: State[] = [];
  form: FormGroup = new FormGroup({});
  city!: City;

  constructor(
    private readonly router: Router,
    private readonly citiesService: CitiesService,
    private readonly statesService: StatesService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;

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

    this.citiesService.findById(this.id).subscribe((resp) => {
      this.city = resp;
      this.form.patchValue(this.city);
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const city: City = this.form.value;
      this.citiesService
        .update(this.id, city)
        .pipe(
          catchError((err) => {
            this.citiesService.showMessage(
              'Cidade não pode ser atualizada!',
              true
            );
            return err;
          })
        )
        .subscribe((resp) => {
          this.citiesService.showMessage('Cidade atualizada com sucesso!');
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

  compareStates(o1: State, o2: State): boolean {
    return o1?.id === o2?.id;
  }
}
