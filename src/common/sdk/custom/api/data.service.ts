import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BadInput } from './../../../error/bad-input';
import { NotFoundError } from './../../../error/not-found-error';
import { AppError } from './../../../error/app-error';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class DataService {
  constructor(private url: string, private http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
      .pipe(
        map((response: Response) => response),
        catchError(this.handleError)
      );
  }

  get(id) {
    return this.http.get(this.url + '/' + id)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  create(resource) {
    return this.http.post(this.url, JSON.stringify(resource))
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  update(resource) {
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify(resource))
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  delete(id) {
    return this.http.delete(this.url + '/' + id)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return throwError(new BadInput(error));
    }
    if (error.status === 404) {
      return throwError(new NotFoundError(error));
    }
    return throwError(new AppError(error));
  }
}
