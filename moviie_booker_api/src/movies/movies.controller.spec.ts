import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            now_playing: jest.fn().mockResolvedValue(['movie1', 'movie2']),
            movies: jest.fn().mockResolvedValue(['movie1', 'movie2']),
            genres: jest.fn().mockResolvedValue(['genre1', 'genre2']),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('nowPlaying', () => {
    it('should return an array of now playing movies', async () => {
      const result = await controller.nowPlaying();
      expect(result).toEqual(['movie1', 'movie2']);
      expect(service.now_playing).toHaveBeenCalled();
    });
  });

  describe('movies', () => {
    it('should return an array of movies based on search and page', async () => {
      const page = '1';
      const search = '{"query": "Harry", "sort_by": "popularity.desc"}';
      const result = await controller.movies(page, search);
      expect(result).toEqual(['movie1', 'movie2']);
      expect(service.movies).toHaveBeenCalledWith(1, { query: 'Harry', sort_by: 'popularity.desc' });
    });
  });

  describe('genres', () => {
    it('should return an array of genres', async () => {
      const result = await controller.genres();
      expect(result).toEqual(['genre1', 'genre2']);
      expect(service.genres).toHaveBeenCalled();
    });
  });
});
