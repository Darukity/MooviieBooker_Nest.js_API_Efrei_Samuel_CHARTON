import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@ApiBearerAuth(
  'access-token',
)
@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MoviesService) {}

    @Get('now_playing')
    async nowPlaying() {
        return this.movieService.now_playing();
    }
    @ApiQuery({ name: 'page', type: Number, required: true, description: 'Page number', example: 1 })
    @ApiQuery({ 
        name: 'search', 
        type: String, 
        required: true, 
        description: 'Filtres de recherche (JSON en string)', 
        example: '{"query": "Harry", "sort_by": "popularity.desc"}' 
    })
    @Get('movies')
    async movies(
        @Query('page') page: string, 
        @Query('search') search: string, 
    ) {
        const parsedSearch = JSON.parse(search);
        return this.movieService.movies(Number(page), parsedSearch);
    }
    

    @Get('genres')
    async genres() {
        return this.movieService.genres();
    }
}
