export {};

declare global {
  interface Window {
    api: {
      expenses: {
        create: (expense: any) => Promise<any>;
        createDetail: (detail: any) => Promise<any>;
        getAll: () => Promise<any>;
        getAllByPeriod: (year: number, month: number) => Promise<any>;
        getOne: (id: number) => Promise<any>;
        remove: (id: number) => Promise<any>;
        removeDetail: (id: number) => Promise<any>;
        loadMock: () => Promise<any>;
        getSummaryByCategories: (year: number, month: number) => Promise<any>;
      };
      categories: {
        getAll: () => Promise<any>;
        create: (category: any) => Promise<any>;
        remove: (categoryId: number) => Promise<any>;
      };
    };
  }
}
