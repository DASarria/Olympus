import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://colliseum-gvh2h4bbd8bgcbfm.brazilsouth-01.azurewebsites.net/";

// Crear instancia de axios para artículos
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Articulo {
    id: number;
    name: string;
    articleStatus: string;
    description: string;
    imageUrl: string;
    quantity?: number;
}

export const getArticulos = async (query?: string): Promise<Articulo[]> => {
    try {
        const params = query ? { params: { q: query } } : {};
        const response = await api.get('/Article', params);
        return response.data.articulos;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("No se pudieron cargar los artículos");
    }
};

export const updateArticulo = async (id: number, updates: Partial<Articulo>): Promise<Articulo> => {
    try {
        const response = await api.put(`/Article/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error("Error updating article:", error);
        throw new Error("No se pudo actualizar el artículo");
    }
};

export const createArticulo = async (articulo: Omit<Articulo, "id">): Promise<Articulo> => {
    try {
        const response = await api.post('/Article', articulo);
        return response.data;
    } catch (error) {
        console.error("Error creating article:", error);
        throw new Error("No se pudo crear el artículo");
    }
};

export const deleteArticulo = async (id: number): Promise<void> => {
    try {
        await api.delete(`/Article/${id}`);
    } catch (error) {
        console.error("Error deleting article:", error);
        throw new Error("No se pudo eliminar el artículo");
    }
};