import { useState, useRef } from 'react'
import type { ExpenseType, Expense } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X } from 'lucide-react'

interface ExpenseFormProps {
  categories: ExpenseType[]
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
}

export function ExpenseForm({ categories, onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [useCurrentDate, setUseCurrentDate] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      console.log('Selected file:', file.name)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (selectedFile) {
      // Handle file processing
      console.log('Processing file:', selectedFile.name)
      // TODO: Add file parsing logic here
      // For now, just reset the file
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }
    
    // Handle manual entry
    if (!amount || !selectedType || !description.trim()) {
      setLoading(false)
      return
    }

    // Validate custom date/time if not using current
    if (!useCurrentDate && (!customDate || !customTime)) {
      setLoading(false)
      return
    }

    // Find the selected category to get its details
    const selectedCategory = categories.find(cat => cat.id.toString() === selectedType)
    
    console.log('Selected category:', selectedCategory)
    console.log('Categories available:', categories)
    
    const tz = 'Asia/Kolkata';
    const now = new Date();

    const finalDate = useCurrentDate
      ? now.toLocaleDateString('en-CA', { timeZone: tz }) // YYYY-MM-DD
      : customDate;

    const finalTime = useCurrentDate
      ? now.toLocaleTimeString('en-GB', { timeZone: tz }) // 24-hour HH:MM:SS
      : customTime;


      console.log('Final date and time:', finalDate, finalTime)
    
    const newExpense: Omit<Expense, 'id'> = {
      amount: parseFloat(amount),
      description: description.trim(),
      category_id: Number(selectedType),
      date: finalDate,
      type: selectedCategory?.type as 'expense' | 'income' || 'expense',
      payment_method: 'cash',
      time: finalTime
    }

    console.log('New expense being created:', newExpense)

    try {
      await onAddExpense(newExpense)
      
      // Reset form only on success
      setAmount('')
      setDescription('')
      setSelectedType('')
      setCustomDate('')
      setCustomTime('')
    } catch (error) {
      console.error('Failed to add expense:', error)
      // You might want to show an error message to the user here
    }
    finally{
      setLoading(false)
    }
  }

  const isFormValid = selectedFile || (
    amount && 
    selectedType && 
    description.trim() && 
    (useCurrentDate || (customDate && customTime))
  )

  return (
    <Card>
      <div className ='flex items-center  justify-between '>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
          <CardDescription>
            Record your income and expenses with details to track your finances
          </CardDescription>
        </CardHeader>
        <Button 
          variant="outline" 
          className='mr-6' 
          onClick={handleFileUpload}
          type="button"
        >
          Upload Transactions <Upload />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls, .pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <CardContent>
        {selectedFile && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Upload className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium max-w-sm text-blue-800 truncate">
                  Selected file: {selectedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 flex-shrink-0 ml-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>  
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount ($)
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!!selectedFile}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expense-type" className="text-sm font-medium">
                Category
              </label>
              <Select value={selectedType} onValueChange={setSelectedType} disabled={!!selectedFile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category.name}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          category.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.type}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={!!selectedFile}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current-date"
              checked={useCurrentDate}
              onCheckedChange={(checked) => setUseCurrentDate(checked === true)}
              disabled={!!selectedFile}
            />
            <label htmlFor="current-date" className="text-sm">
              Use current date and time
            </label>
          </div>

          {/* Custom Date and Time Inputs */}
          {!useCurrentDate && (
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <label htmlFor="custom-date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="custom-date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  disabled={!!selectedFile}
                  required={!useCurrentDate}
                  className=""
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="custom-time" className="text-sm font-medium">
                  Time
                </label>
                <Input
                  id="custom-time"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  disabled={!!selectedFile}
                  required={!useCurrentDate}
                  className=""
                />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || loading}
          >
            <span className="truncate max-w-sm">
              {selectedFile 
                ? `Process - ${selectedFile.name}` 
                : `Add ${categories.find(cat => cat.id.toString() === selectedType)?.type === 'income' ? 'Income' : 'Expense'}`
              }
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}