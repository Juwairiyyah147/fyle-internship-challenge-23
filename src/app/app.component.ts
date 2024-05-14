import { Component } from '@angular/core';
import { PaginationService } from './pagination.service';
import { ApiService } from './services/api.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username: string = '';
  repositories: any[] = [];
  userNotFound: boolean = false;
  user: any = null; //user property
  currentPage: number = 1;
  pageSize: number = 10;
  totalRepositories: number = 0;
  isLoadingUser: boolean = false;
  isLoadingRepositories: boolean = false;
 
    
  constructor(
    private apiService: ApiService,
    private paginationService: PaginationService 
  ) { }

  fetchUserData() {
    this.isLoadingUser = true; //set loading flag
    this.apiService.getUser(this.username).subscribe(
      (user: any) => {
        this.user = user;
        this.userNotFound = false;
        this.isLoadingUser = false; //clear loading flag
        
      },
      (error) => {
        console.error('Error fetching user data: ', error);
        
       
        
          this.user = null;// Reset user data on error
        this.userNotFound = true; // set user not found flag
        this.isLoadingUser = false;
        
        
      }
    );
  }
  getTotalRepositoriesCount() {
    this.apiService.getRepos(this.username).subscribe(
      (repos: any[]) => {
        this.totalRepositories = repos.length;
      },
      (error) => {
        console.error('Error fetching total repositories count: ', error);
        this.totalRepositories = 0;
      }
    );
  }

  fetchRepositories() {
    this.isLoadingRepositories = true;
    this.fetchUserData();
    this.getTotalRepositoriesCount()
    this.paginationService.getPaginatedRepositories(this.username, this.currentPage, this.pageSize).subscribe(
        (repos: any[]) => {
        this.repositories = repos;
        this.isLoadingRepositories = false;
          
        },
        (error) => {
          console.error('Error fetching repositories: ', error);
          this.repositories = [];
          this.isLoadingRepositories = false;
         
        }
      );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchRepositories();
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = parseInt(value, 10); // Convert to number
    this.currentPage = 1; // Reset to first page when changing page size
    this.fetchRepositories();
  }

}


