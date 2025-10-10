import type { Expense, ExpenseType } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ExpenseSummaryProps {
  expenses: Expense[]
  categories: ExpenseType[]
}

interface ExpenseBreakdown {
  type: string
  total: number
  count: number
  percentage: number
}

export function ExpenseSummary({ expenses, categories }: ExpenseSummaryProps) {
  const totalExpenses = expenses.filter(expense => expense.type === 'expense').reduce((sum, expense) => sum + expense.amount, 0)
  const totalIncome = expenses.filter(expense => expense.type === 'income').reduce((sum, expense) => sum + expense.amount, 0)
  const netAmount = totalIncome - totalExpenses
  
  const expensesByType: ExpenseBreakdown[] = categories.map(category => {
    const categoryTransactions = expenses.filter(expense => expense.category_id === category.id)
    const total = categoryTransactions.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      type: category.name,
      total,
      count: categoryTransactions.length,
      percentage: totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0
    }
  }).filter(item => item.count > 0)

  const highestCategory = expensesByType.reduce((max, current) => 
    current.total > max.total ? current : max, 
    { type: 'None', total: 0, count: 0, percentage: 0 }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>
          Overview of your income, expenses, and spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-green-600">+${totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">-${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Net Amount</h3>
              <p className={`text-3xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netAmount >= 0 ? '+' : ''}${netAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Highest Spending Category</h3>
              <p className="text-xl font-semibold text-gray-800">{highestCategory.type}</p>
              <p className="text-sm text-gray-600">${highestCategory.total.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Transactions</h3>
              <p className="text-xl font-semibold text-gray-800">{expenses.length}</p>
              <p className="text-sm text-gray-600">
                {expenses.filter(e => e.type === 'income').length} income, {expenses.filter(e => e.type === 'expense').length} expenses
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
          <p className="text-gray-600 mb-4">Detailed breakdown by category</p>
          
          {expensesByType.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transaction data available. Add some transactions to see the breakdown.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {expensesByType.map(item => (
                <Card key={item.type}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800">{item.type}</h4>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${item.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{item.percentage}%</p>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2 mb-2" />
                    <p className="text-xs text-gray-500">{item.count} transactions</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}