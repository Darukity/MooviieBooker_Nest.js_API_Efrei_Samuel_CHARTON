import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock_api_key'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn().mockResolvedValue({
                data: { results: [] },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
              } as AxiosResponse),
            },
          },
        },
      ],
    }).compile();
  
    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('nowPlaying', () => {
    it('should return a list of currently playing movies', async () => {
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
        data: { results: ['Movie1', 'Movie2'] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse);
      
      const result = await service.now_playing();
      expect(result).toEqual({ results: ['Movie1', 'Movie2'] }); // Fix expected format
    });
  });
  

  describe('movies', () => {
    it('should return a list of movies based on search and pagination', async () => {
      const mockQuery = { query: 'Harry', sort_by: 'popularity.desc' };
  
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
        data: { results: ['Harry Potter 1', 'Harry Potter 2'] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse);
  
      const result = await service.movies(1, mockQuery);
      expect(result).toEqual({ results: ['Harry Potter 1', 'Harry Potter 2'] }); // Ensure correct format
    });
  });
  

  describe('genres', () => {
    it('should return a list of genres', async () => {
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
        data: { genres: ['Action', 'Comedy'] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse);
      
      const result = await service.genres();
      expect(result).toEqual({ genres: ['Action', 'Comedy'] }); // Fix expected format
    });
  });  
});
