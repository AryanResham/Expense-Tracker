export interface ExpenseType {
  id: number,
  user_id: null,
  name: string,
  description: string,
  color: string,
  icon: string,
  is_system: boolean,
  type: string
}

export interface Expense {
  id: string
  category_id: number
  amount: number
  description: string
  type: 'expense' | 'income'
  payment_method: string
  time: string
  date: string
}

export type ActiveTab = 'add' | 'list' | 'summary'

