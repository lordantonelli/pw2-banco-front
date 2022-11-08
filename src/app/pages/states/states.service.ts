import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ResponseDataList } from 'src/app/models/shared.model';
import { State } from 'src/app/models/state.model';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  private baseApi: string = '/states';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<State[]> {
    const params = new HttpParams().set('limit', '99');

    return this.http
      .get<ResponseDataList<State>>(environment.baseUrl + this.baseApi, {
        params,
      })
      .pipe(map((resp) => resp.items));
  }
}
