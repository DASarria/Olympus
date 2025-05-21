// services/articleService.ts
import apiClient from './apiClient';

interface Article {
  id: number;
  name: string;
  description: string;
  articleStatus: string;
  imageUrl: string;
  horariosDisponibles?: {
    manana: boolean;
    tarde: boolean;
    noche: boolean;
  };
}

const ArticleService = {
  async getAllArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.get('/Article');
      return response.data.articulos.map((article: any) => ({
        id: article.id,
        name: article.name,
        description: article.description,
        articleStatus: article.articleStatus.toLowerCase(),
        imageUrl: article.imageUrl,
        // Mapear estados del backend a los que usa tu frontend
        status: article.articleStatus === 'Disponible' ? 'disponible' : 
               article.articleStatus === 'RequireMantenimiento' ? 'mantenimiento' : 'dañado'
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  async getAvailableArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.get('/Article?q=Disponible');
      return response.data.articulos.map((article: any) => ({
        id: article.id,
        name: article.name,
        description: article.description,
        articleStatus: article.articleStatus.toLowerCase(),
        imageUrl: article.imageUrl,
        status: 'disponible'
      }));
    } catch (error) {
      console.error('Error fetching available articles:', error);
      throw error;
    }
  }
};

export default ArticleService;