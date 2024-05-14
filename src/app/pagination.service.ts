import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { tap, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private httpClient: HttpClient) { }
  getPaginatedRepositories(username: string, page: number, pageSize: number): Observable<any> {
    const url = `https://api.github.com/users/${username}/repos`;

    // Set pagination parameters
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', pageSize.toString());

    // Make HTTP GET request with pagination parameters
    return this.httpClient.get<any[]>(url, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors here
        if (error.status === 404) {
          // Return a new error with the desired error message
          return throwError(new HttpResponse({ status: 404 }));
        } else {
          // For other errors, re-throw the original error
          return throwError(error);
        }
      })
    );
  }
}
