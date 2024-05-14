import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError,of } from 'rxjs';
import { PaginationService } from './pagination.service';

const repos = [{ name: 'repo1' }, { name: 'repo2' }];
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let paginationServiceSpy: jasmine.SpyObj<PaginationService>; 

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('ApiService', ['getUser', 'getRepos']);
    const paginationServiceSpy = jasmine.createSpyObj('PaginationService', ['getPaginatedRepositories']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [AppComponent],
      providers: [{ provide: ApiService, useValue: spy }, { provide: PaginationService, useValue: paginationServiceSpy }]
    }).compileComponents();

    paginationServiceSpy.getPaginatedRepositories.and.returnValue(of(repos));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    //paginationServiceSpy = TestBed.inject(PaginationService) as jasmine.SpyObj<PaginationService>;
    fixture.detectChanges();
  });



  it('should create the app', () => {
 
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.username).toEqual('');
    expect(component.repositories).toEqual([]);
    expect(component.userNotFound).toBeFalse();
    expect(component.user).toBeNull();
    expect(component.currentPage).toEqual(1);
    expect(component.pageSize).toEqual(10);
    expect(component.totalRepositories).toEqual(0);
  });

  it('should fetch user data on calling fetchUserData', () => {
    const user = { login: 'testUser', bio: 'Test bio', location: 'Test location', twitter_username: 'test_twitter' };
    apiServiceSpy.getUser.and.returnValue(of(user));
    component.username = 'testUser';
    component.fetchUserData();
    expect(apiServiceSpy.getUser).toHaveBeenCalledWith('testUser');
    expect(component.user).toEqual(user);
    expect(component.userNotFound).toBeFalse();
  });

  it('should handle error while fetching user data', () => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' }); // Create a 404 error
    apiServiceSpy.getUser.and.returnValue(throwError(error));
    component.username = 'invalidUser';
    component.fetchUserData();
    expect(apiServiceSpy.getUser).toHaveBeenCalledWith('invalidUser');
    expect(component.user).toBeNull();
    expect(component.userNotFound).toBeTrue();
  });
  it('should fetch repositories on calling fetchRepositories', () => {
    const repos = [{ name: 'repo1' }, { name: 'repo2' }];
    component.username = 'testUser';
    component.fetchRepositories();
    //expect(apiServiceSpy.getRepos).toHaveBeenCalledWith('testUser');
    expect(paginationServiceSpy.getPaginatedRepositories).toHaveBeenCalledWith('testUser', component.currentPage, component.pageSize);
    expect(component.repositories).toEqual(repos);
  });

  it('should handle error while fetching repositories', () => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' }); // Create a 404 error
    component.username = 'testUser';
    component.fetchRepositories();
    //expect(apiServiceSpy.getRepos).toHaveBeenCalledWith('testUser');
    expect(paginationServiceSpy.getPaginatedRepositories).toHaveBeenCalledWith('testUser', component.currentPage, component.pageSize);
    expect(component.repositories).toEqual([]);
    expect(component.userNotFound).toBeFalse();
  });


});
