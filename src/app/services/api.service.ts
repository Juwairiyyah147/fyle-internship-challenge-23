import { HttpClient, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors here
        // Return a new error with the status code and message
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
  
    getRepos(githubUsername: string) {
      return this.httpClient.get<any[]>(`https://api.github.com/users/${githubUsername}/repos`).pipe(
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
  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
}
