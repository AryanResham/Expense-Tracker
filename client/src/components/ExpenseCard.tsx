import type { Expense, ExpenseType } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ExpenseCardProps {
  expense: Expense
  categories: ExpenseType[]
}

export function ExpenseCard({ expense, categories }: ExpenseCardProps) {
  const getExpenseTypeName = (categoryId: number) => {
    return categories.find(type => type.id === categoryId)?.name || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  const { date, time } = formatDate(expense.date)

  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-gray-800">
              {expense.description || 'No description'}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="w-fit">
                {getExpenseTypeName(expense.category_id)}
              </Badge>
              <Badge 
                variant={expense.type === 'income' ? 'default' : 'destructive'} 
                className={`w-fit ${
                  expense.type === 'income' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                {expense.type || 'expense'}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              {date} at {time} • {expense.payment_method || 'cash'}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${
              expense.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {expense.type === 'income' ? '+' : '-'}${(expense.amount || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}