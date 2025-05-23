const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://colliseum-gvh2h4bbd8bgcbfm.brazilsouth-01.azurewebsites.net/";

export interface Articulo {
    id: number;
    name: string;
    articleStatus: string;
    description: string;
    imageUrl: string;
    quantity?: number;
}

export const getArticulos = async (): Promise<Articulo[]> => {
    try {
        const response = await fetch(`${API_URL}Article`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("No se pudieron cargar los artículos");
    }
};

export const updateArticulo = async (id: number, updates: Partial<Articulo>): Promise<Articulo> => {
    try {
        const response = await fetch(`${API_URL}Article/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(updates),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error updating article:", error);
        throw new Error("No se pudo actualizar el artículo");
    }
};

export const createArticulo = async (articulo: Omit<Articulo, "id">): Promise<Articulo> => {
    try {
        const response = await fetch(`${API_URL}Article`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(articulo),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error creating article:", error);
        throw new Error("No se pudo crear el artículo");
    }
};