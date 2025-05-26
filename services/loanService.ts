import api from './api';

export interface LoanArticle {
  id: string;
  articleIds: number[];
  nameUser: string;
  userId: string;
  userRole: string;
  loanStatus: 'Prestado' | 'Devuelto' | 'Vencido';
  loanDate: string;
  devolutionDate: string;
  startTime: string;
  endTime: string;
  loanDescriptionType: string;
  equipmentStatus?: string;
  devolutionRsegister?: string;
  creationDate?: string;
}

export interface CreateLoanRequest {
  articleIds: number[];
  nameUser: string;
  userId: string;
  userRole: string;
  loanDescriptionType: string;
  loanDate?: string;
  startTime: string;
  endTime: string;
}

export interface LoanResponse {
  cantidad: number;
  prestamos: LoanArticle[];
}

// Función para detectar el rol del usuario automáticamente
export const detectUserRole = (): 'student' | 'teacher' => {
  // Prioridad: sessionStorage > localStorage > defaultRole basado en el usuario
  const sessionRole = sessionStorage.getItem('userRole');
  if (sessionRole === 'student' || sessionRole === 'teacher') {
    return sessionRole;
  }

  const localRole = localStorage.getItem('userRole');
  if (localRole === 'student' || localRole === 'teacher') {
    return localRole;
  }

  // Por defecto, considerar estudiante
  return 'student';
};

// Función para obtener información del usuario actual
export const getCurrentUser = () => {
  return {
    userId: 'Juan-cely-l', // En producción vendría del contexto de autenticación
    role: detectUserRole(),
    displayName: 'Juan Cely'
  };
};

class LoanService {
  private readonly baseUrl = '/LoanArticle';

  // Obtener préstamos del usuario actual (MisReservas)
  async getMyLoans(): Promise<LoanResponse> {
    try {
      const user = getCurrentUser();
      const response = await api.get(`${this.baseUrl}?q=${encodeURIComponent(user.userId)}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis reservas:', error);
      throw new Error('Error al cargar las reservas');
    }
  }

  // Crear una nueva reserva
  async createLoan(loanData: CreateLoanRequest): Promise<LoanArticle> {
    try {
      const user = getCurrentUser();

      const requestData = {
        ...loanData,
        nameUser: user.displayName,
        userId: user.userId,
        userRole: user.role === 'student' ? 'Estudiante' : 'Profesor',
        loanDate: loanData.loanDate || new Date().toISOString().split('T')[0],
        loanStatus: 'Prestado'
      };

      const response = await api.post(
        `${this.baseUrl}?startTime=${encodeURIComponent(loanData.startTime)}&endTime=${encodeURIComponent(loanData.endTime)}`,
        requestData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al crear reserva:', error);
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw new Error('Error al crear la reserva');
    }
  }

  // Actualizar reserva (solo si está Vencido)
  async updateLoan(
    id: string,
    updates: Partial<LoanArticle>,
    startTime?: string,
    endTime?: string
  ): Promise<LoanArticle> {
    try {
      const user = getCurrentUser();
      const loan = await this.getLoanById(id);

      // Verificar que el préstamo pertenece al usuario actual
      if (loan.userId !== user.userId) {
        throw new Error('No tienes permisos para modificar este préstamo');
      }

      // Verificar que solo se pueden modificar préstamos vencidos
      if (loan.loanStatus !== 'Vencido') {
        throw new Error('Solo puedes modificar reservas que están vencidas');
      }

      let url = `${this.baseUrl}/${id}`;
      const params = new URLSearchParams();

      if (startTime) params.append('startTime', startTime);
      if (endTime) params.append('endTime', endTime);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.put(url, updates);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar reserva:', error);
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw new Error('Error al actualizar la reserva');
    }
  }

  // Eliminar reserva (solo si está Devuelto)
  async deleteLoan(id: string): Promise<void> {
    try {
      const user = getCurrentUser();
      const loan = await this.getLoanById(id);

      // Verificar que el préstamo pertenece al usuario actual
      if (loan.userId !== user.userId) {
        throw new Error('No tienes permisos para eliminar este préstamo');
      }

      // Verificar que solo se pueden eliminar préstamos devueltos
      if (loan.loanStatus !== 'Devuelto') {
        throw new Error('Solo puedes eliminar reservas que están devueltas');
      }

      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Error al eliminar reserva:', error);
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw new Error('Error al eliminar la reserva');
    }
  }

  // Obtener una reserva por ID
  async getLoanById(id: string): Promise<LoanArticle> {
    try {
      const response = await api.get(`${this.baseUrl}?q=${encodeURIComponent(id)}`);
      if (response.data.prestamos && response.data.prestamos.length > 0) {
        return response.data.prestamos[0];
      }
      throw new Error('Reserva no encontrada');
    } catch (error) {
      console.error('Error al obtener reserva:', error);
      throw new Error('Error al obtener la reserva');
    }
  }

  // Devolver reserva
  async devolverLoan(id: string): Promise<LoanArticle> {
    try {
      const user = getCurrentUser();
      const loan = await this.getLoanById(id);

      // Verificar que el préstamo pertenece al usuario actual
      if (loan.userId !== user.userId) {
        throw new Error('No tienes permisos para devolver este préstamo');
      }

      const response = await api.put(`${this.baseUrl}/${id}`, {
        devolver: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al devolver reserva:', error);
      if (error.response?.data?.Message) {
        throw new Error(error.response.data.Message);
      }
      throw new Error('Error al devolver la reserva');
    }
  }
}

export default new LoanService();