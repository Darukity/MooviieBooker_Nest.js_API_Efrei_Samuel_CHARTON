import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@ApiBearerAuth(
  'access-token',
)
@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MoviesService) {}

    @Get('now_playing')
    @ApiOperation({ summary: 'Get now playing movies up to date' })
    async nowPlaying() {
        return this.movieService.now_playing();
    }
    
    @Get('movies')
    @ApiQuery({ name: 'page', type: Number, required: true, description: 'Page number', example: 1 })
    @ApiQuery({ 
        name: 'search', 
        type: String, 
        required: true, 
        description: 'Filtres de recherche (JSON en string)', 
        example: '{"query": "Harry", "sort_by": "popularity.desc"}' 
    })
    @ApiOperation({ summary: 'Get movies by search, with a querry and or with a sort type' })
    async movies(
        @Query('page') page: string, 
        @Query('search') search: string, 
    ) {
        const parsedSearch = JSON.parse(search);
        return this.movieService.movies(Number(page), parsedSearch);
    }

    @Get('genres')
    @ApiOperation({ summary: 'Get a list of movie genres' })
    async genres() {
        return this.movieService.genres();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get movie details by id' })
    async movie(@Query('id') id: string) {
        return this.movieService.movie(id);
    }
}
