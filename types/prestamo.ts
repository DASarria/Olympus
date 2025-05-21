
export interface Prestamo {
    id: string;
    articleIds: number[];
    nameUser: string;
    userId: string;
    userRole: string;
    loanDescriptionType: string;
    creationDate: string;
    loanDate: string;
    devolutionDate: string;
    loanStatus: string;
    equipmentStatus: string;
    devolutionRegister: string;
    startTime?: string;
    endTime?: string;
  }