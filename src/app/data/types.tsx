// Types
export interface User {
  name: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Transaction types
export interface Transaction {
  name: string;
  email: string;
  amount: string;
  type: string;
  date: string;
  category: string;
  createdAt: string;
  
}

export type TotalsType = {
  income: number;
  expense: number;
  savings: number;
  balance: number;
};

export interface TransContextType {
  transactions: Transaction[];
  addTransaction: (txn: Transaction) => void;
  deleteTransaction: (index: number) => boolean; 
  editTransaction: (index: number, updatedTxn: Transaction) => void;
  totals: TotalsType | null;
}

export interface TransactionFormProps {
  initialValues?: {
    amount: string;
    type: string;
    date: string | null;
    category: string;
  };
  mode: "add" | "edit";
  onSubmit: (formData: any) => void;
};

//searchbar


export interface placeholderProps{
  placeholder:string;
}

export interface DropdownProps {
  options: string[];
  value: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string; 
  disabled?: boolean; 
};

//Datepicker

export interface DatePickerComponentProps {
  selectedDate: Date | null;
  onChangeDate: (date: Date | null) => void;
  placeholder?: string;
  showClear?: boolean;
}

//confirm modal

export interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

//search bar
export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onSearch: (term: string) => void;
}



//filter Ui

export interface FilterUiProps  {
  transactions: Transaction[];
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
};

//pagination 

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

//progress bar
export interface ProgressBarProps {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
};

// 
export interface DateRangePickerProps {
  dateRange: [Date | null, Date | null];
  setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
  showPanel: boolean;
  setShowPanel: React.Dispatch<React.SetStateAction<boolean>>;
};