
import type { Expense } from './lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseForm } from '@/components/ExpenseForm'
import { ExpenseList } from '@/components/ExpenseList'
import { ExpenseSummary } from '@/components/ExpenseSummary'
import Header from './components/Header'
import { useTransactions } from './hooks/useExpenses'
import { Spinner } from './components/ui/shadcn-io/spinner'

function App() {
  const { categories, transactions, loading, error, addTransaction } = useTransactions();
  
  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    try {
      await addTransaction(newExpense);
    } catch (error) {
      console.error('Failed to add expense:', error);
      // You might want to show a toast notification here
    }
  };

  if (loading) {
    return (
      <Spinner/>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 justify-center p-10">
      <div className="flex-1 max-w-4xl ">
        <div className="text-3xl text-center text-gray-800 mb-4">
          <Header />
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="add">Add Expense</TabsTrigger>
            <TabsTrigger value="list">Expenses List</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add">
            <ExpenseForm 
              categories={categories}
              onAddExpense={handleAddExpense}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <ExpenseList 
              expenses={transactions}
              categories={categories}
            />
          </TabsContent>
          
          <TabsContent value="summary">
            <ExpenseSummary 
              expenses={transactions}
              categories={categories}
            />
          </TabsContent>
        </Tabs>
      </div>
  
    </div>
  )
}

export default App
