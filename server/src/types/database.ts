export interface User {
  id: string; // uuid
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export interface ExpenseCategory {
  id: number; // int4
  user_id: string; // uuid
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_system: boolean;
}

export interface Expense {
  id: string; // uuid
  user_id: string; // uuid
  category_id: number; // int8/int4
  amount: number; // numeric
  description?: string;
  expense_date: string; // date (ISO string)
  expense_time?: string; // time (HH:MM:SS format)
  payment_method?: string;
  created_at?: string; // timestamp (ISO string)
}

// Request/Response types for API
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface CreateCategoryRequest {
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_system?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_system?: boolean;
}

export interface CreateExpenseRequest {
  user_id: string;
  category_id: number;
  amount: number;
  description?: string;
  expense_date: string;
  expense_time?: string;
  payment_method?: string;
}

export interface UpdateExpenseRequest {
  category_id?: number;
  amount?: number;
  description?: string;
  expense_date?: string;
  expense_time?: string;
  payment_method?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
