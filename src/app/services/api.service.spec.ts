import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse} from '@angular/common/http';
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
});
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call the getUser method with the correct username', () => {
    const username = 'testUser';
    const mockUser = { login: 'testUser', bio: 'Test bio', location: 'Test location', twitter_username: 'test_twitter' };

    service.getUser(username).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call the getRepos method with the correct username', () => {
    const username = 'testUser';
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];

    service.getRepos(username).subscribe(repos => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should handle errors when calling getUser', () => {

    

    const username = 'invalidUser';
    const errorMessage = 'User not found';

    service.getUser(username).subscribe(
      () => fail('getUser should have failed with 404 error'),
      error => {
        expect(error.status).toBe(404);
        expect(error.error.message).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should handle errors when calling getRepos', () => {
    const username = 'testUser';
    const errorMessage = 'Repositories not found';

    service.getRepos(username).subscribe(
      () => fail('getRepos should have failed with 404 error'),
      error => {
        expect(error.status).toBe(404);
        expect(error.error.message).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
