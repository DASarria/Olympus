// services/loanService.ts
import apiClient from './apiClient';

interface LoanArticle {
  articleIds: number[];
  nameUser: string;
  userId: string;
  userRole: string;
  loanDescriptionType: string;
  loanDate: string;
  loanStatus: string;
  equipmentStatus: string;
  startTime: string;
  endTime: string;
}

interface Reservation {
  id: string;
  articleIds: number[];
  nameUser: string;
  userId: string;
  startTime: string;
  endTime: string;
  loanDate: string;
  status: string;
  articles: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
}

const LoanService = {
  async createLoan(loanData: LoanArticle): Promise<any> {
    try {
      const response = await apiClient.post('/LoanArticle', loanData, {
        params: {
          startTime: loanData.startTime,
          endTime: loanData.endTime
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  },

  async getUserLoans(userId: string): Promise<Reservation[]> {
    try {
      const response = await apiClient.get(`/LoanArticle?q=U-${userId}`);
      return response.data.prestamos.map((loan: any) => ({
        id: loan.id,
        articleIds: loan.articleIds,
        nameUser: loan.nameUser,
        userId: loan.userId,
        startTime: loan.startTime,
        endTime: loan.endTime,
        loanDate: loan.loanDate,
        status: loan.loanStatus,
        articles: loan.articleIds.map((id: number) => ({
          id,
          name: 'Nombre no disponible', // Se puede mejorar con una llamada adicional
          imageUrl: '/assets/images/placeholder.png'
        }))
      }));
    } catch (error) {
      console.error('Error fetching user loans:', error);
      throw error;
    }
  },

  async cancelLoan(loanId: string): Promise<void> {
    try {
      await apiClient.delete(`/LoanArticle/${loanId}`);
    } catch (error) {
      console.error('Error canceling loan:', error);
      throw error;
    }
  }
};

export default LoanService;