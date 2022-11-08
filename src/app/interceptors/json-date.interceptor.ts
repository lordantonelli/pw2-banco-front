import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cloneDeep, isDate } from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JsonDateInterceptor implements HttpInterceptor {
  private _isoDateFormat: RegExp =
    // eslint-disable-next-line max-len
    /(\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modified = req.clone({
      params: this._convertParamsRequest(cloneDeep(req.params)),
      body: this._convertBodyRequest(req.body),
    });

    return next.handle(modified).pipe(
      catchError((error: any) => {
        const body = error.data;
        this._convertBodyResponse(body);
        return throwError(() => error);
      }),
      map((val: HttpEvent<any>) => {
        if (val instanceof HttpResponse) {
          const body = val.body;
          this._convertBodyResponse(body);
        }
        return val;
      })
    );
  }

  private _adjustTimezone(
    value: string | Date,
    origin: 'request' | 'response',
    iteration: number = 0
  ): Date {
    const date = new Date(value);
    let timezone = date.getTimezoneOffset() * 60 * 1000;
    timezone *= origin === 'request' ? -1 : 1;
    const adjust = new Date(date.getTime() + timezone);
    return date.getTimezoneOffset() === adjust.getTimezoneOffset() ||
      iteration > 3
      ? adjust
      : this._adjustTimezone(adjust, origin, iteration++);
  }

  private _convertBodyRequest(body: any): void {
    if (!body) {
      return body;
    }

    if (typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      const value = body[key];
      if (isDate(value) || this._isIsoDateString(value)) {
        body[key] = this._adjustTimezone(value, 'request');
      } else if (typeof value === 'object') {
        this._convertBodyRequest(value);
      }
    }

    return body;
  }

  private _convertBodyResponse(body: any): void {
    if (!body) {
      return body;
    }

    if (typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      const value = body[key];
      if (this._isIsoDateString(value)) {
        body[key] = this._adjustTimezone(value, 'response');
      } else if (typeof value === 'object') {
        this._convertBodyResponse(value);
      }
    }
  }

  private _convertParamsRequest(params: HttpParams): HttpParams {
    if (!params) {
      return params;
    }

    for (const key of params.keys()) {
      const value = params.get(key);
      if (value && this._isIsoDateString(value)) {
        params = params.set(
          key,
          this._adjustTimezone(value, 'request').toISOString()
        );
      }
    }

    return params;
  }

  private _isIsoDateString(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return this._isoDateFormat.test(value);
    }
    return false;
  }
}
