import { useState } from 'react'
import type { Expense, ExpenseType } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ExpenseCard } from './ExpenseCard'

interface ExpenseListProps {
  expenses: Expense[]
  categories: ExpenseType[]
}

export function ExpenseList({ expenses, categories }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Sort expenses by date in reverse chronological order (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA // Reverse order (newest first)
  })

  const filteredExpenses = sortedExpenses.filter(expense => {
    const matchesSearch = (expense.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTypeFilter === 'all' || expense.category_id.toString() === selectedTypeFilter
    return matchesSearch && matchesType
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleTypeFilterChange = (value: string) => {
    setSelectedTypeFilter(value)
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View and filter your past transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedTypeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(type => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{type.name}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${
                        type.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {type.type}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        {filteredExpenses.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredExpenses.length)} of {filteredExpenses.length} transactions
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </div>
        )}

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {expenses.length === 0 
                ? "No transactions found. Add some transactions to see them here."
                : "No transactions match your search criteria."
              }
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {currentExpenses.map((expense, index) => (
                <ExpenseCard 
                  key={expense.id || `expense-${index}`} 
                  expense={expense} 
                  categories={categories}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(value) => goToPage(parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}