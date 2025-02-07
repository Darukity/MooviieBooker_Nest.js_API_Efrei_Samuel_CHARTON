import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import e from 'express';

@Injectable()
export class MoviesService {
    private apiUrl: string;
    private apiKey: string;
    
    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.apiUrl = this.configService.get('API_URL') || "";
        this.apiKey = this.configService.get('API_KEY') || "";
    }

    async now_playing() {
        let url = `${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=fr-FR`;
        try {
            const response = await this.httpService.axiosRef.get(url)
            return response.data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Erreur interne', HttpStatus.BAD_REQUEST);
        }
    }

    async movies(page: number, search: any) {
        const query = encodeURIComponent(search.query || '');
        const sortBy = encodeURIComponent(search.sort_by || 'popularity.desc');
    
        let url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=fr-FR&query=${query}&sort_by=${sortBy}&page=${page}&include_adult=false`;
    
        try {
            const response = await this.httpService.axiosRef.get(url);
            return response.data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Erreur interne', HttpStatus.BAD_REQUEST);
        }
    }

    async movie(id: string) {
        let url = `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}&language=fr-FR`;
        try {
            const response = await this.httpService.axiosRef.get(url);
            return response.data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Erreur interne', HttpStatus.BAD_REQUEST);
        }
    }

    async genres() {
        let url = `${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=fr-FR`;
        try {
            const response = await this.httpService.axiosRef.get(url);
            return response.data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Erreur interne', HttpStatus.BAD_REQUEST);
        }
    }
}
