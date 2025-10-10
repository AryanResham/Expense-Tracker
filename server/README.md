# Expense Tracker API

A RESTful API for managing personal expenses, categories, and users using Supabase as the database.

## Features

- User management (CRUD operations)
- Expense category management with user association
- Expense tracking with category relationships
- Expense summaries and analytics
- Data validation and error handling
- CORS support for frontend integration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories

- `GET /api/categories` - Get all categories (optional: ?user_id=xxx)
- `GET /api/categories/user/:userId` - Get categories for specific user
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses

- `GET /api/expenses` - Get all expenses with filters
- `GET /api/expenses/user/:userId` - Get expenses for specific user
- `GET /api/expenses/summary/:userId` - Get expense summary for user
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Query Parameters

### Expenses endpoints support these filters:

- `user_id` - Filter by user ID
- `category_id` - Filter by category ID
- `start_date` - Filter expenses from this date (YYYY-MM-DD)
- `end_date` - Filter expenses until this date (YYYY-MM-DD)
- `limit` - Limit number of results

## Request/Response Format

All endpoints return responses in this format:

```json
{
  "success": true|false,
  "data": {...}, // Only on success
  "error": "Error message", // Only on error
  "message": "Success message" // Optional
}
```

## Database Schema

### Users Table

- `id` (uuid, primary key)
- `name` (text, required)
- `email` (text, required)
- `phone` (text, optional)
- `avatar_url` (text, optional)

### Expense Categories Table

- `id` (int4, primary key)
- `user_id` (uuid, foreign key to users)
- `name` (text, required)
- `description` (text, optional)
- `color` (text, optional)
- `icon` (text, optional)
- `is_system` (boolean, default: false)

### Expenses Table

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `category_id` (int8, foreign key to expense_categories)
- `amount` (numeric, required)
- `description` (text, optional)
- `expense_date` (date, required)
- `expense_time` (time, optional)
- `payment_method` (text, optional)
- `created_at` (timestamp, auto-generated)

## Example Requests

### Create User

```bash
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### Create Category

```bash
POST /api/categories
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Food & Dining",
  "description": "Restaurant meals and groceries",
  "color": "#FF6B6B",
  "icon": "🍕"
}
```

### Create Expense

```bash
POST /api/expenses
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "category_id": 1,
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "expense_date": "2025-10-01",
  "expense_time": "12:30:00",
  "payment_method": "Credit Card"
}
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

All errors return a consistent JSON format with descriptive error messages.

- [Environment Configuration](#environment-configuration)
- [Usage Examples](#usage-examples)

---

## 🎯 Overview

This expense tracker backend uses **MongoDB** with **Mongoose** for ODM and **TypeScript** for type safety. The architecture provides:

- **Flexible Schema** - NoSQL document structure with validation
- **Type Safety** - Full TypeScript integration with Mongoose
- **Performance** - Strategic indexes and aggregation pipelines
- **Scalability** - MongoDB's horizontal scaling capabilities
- **Rich Queries** - MongoDB's powerful query language
- **Data Integrity** - Mongoose validation and middleware

---

## 🏗️ MongoDB Schema

### Collections Overview

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│         ExpenseTypes            │    │           Expenses              │
├─────────────────────────────────┤    ├─────────────────────────────────┤
│ _id (ObjectId)                  │◄───┤ typeId (ObjectId) ref           │
│ name (String) - unique          │    │ _id (ObjectId)                  │
│ description (String)            │    │ amount (Number)                 │
│ color (String) - hex color      │    │ description (String)            │
│ icon (String)                   │    │ category (String)               │
│ isActive (Boolean)              │    │ date (Date)                     │
│ createdAt (Date)                │    │ tags (Array<String>)            │
│ updatedAt (Date)                │    │ notes (String)                  │
└─────────────────────────────────┘    │ location (String)               │
                                       │ paymentMethod (String)          │
                                       │ receiptUrl (String)             │
                                       │ isRecurring (Boolean)           │
                                       │ recurringFrequency (String)     │
                                       │ isDeleted (Boolean)             │
                                       │ createdAt (Date)                │
                                       │ updatedAt (Date)                │
                                       └─────────────────────────────────┘
```

---

## 📊 ExpenseType Model

### Schema Definition

```typescript
const expenseTypeSchema = new Schema<IExpenseType>(
  {
    name: {
      type: String,
      required: [true, "Expense type name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    color: {
      type: String,
      trim: true,
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Color must be a valid hex color code",
      ],
      default: "#6B7280",
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
```

### Default Expense Types

The system comes with pre-configured expense types:

| Name           | Description                                 | Color   | Icon            |
| -------------- | ------------------------------------------- | ------- | --------------- |
| Food & Dining  | Restaurants, groceries, and food delivery   | #EF4444 | utensils        |
| Transportation | Gas, public transport, rideshare, parking   | #3B82F6 | car             |
| Housing        | Rent, mortgage, utilities, home maintenance | #10B981 | home            |
| Utilities      | Electricity, water, internet, phone         | #F59E0B | zap             |
| Entertainment  | Movies, games, subscriptions, hobbies       | #8B5CF6 | film            |
| Healthcare     | Medical bills, pharmacy, fitness            | #EF4444 | heart           |
| Shopping       | Clothing, electronics, personal items       | #F97316 | shopping-bag    |
| Other          | Miscellaneous expenses                      | #6B7280 | more-horizontal |

---

## 💳 Expense Model

### Schema Definition

```typescript
const expenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      max: [999999.99, "Amount cannot exceed $999,999.99"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food & Dining",
        "Transportation",
        "Housing",
        "Utilities",
        "Entertainment",
        "Healthcare",
        "Shopping",
        "Other",
      ],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    typeId: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseType",
      required: [true, "Expense type is required"],
    },
    // ... additional fields
  },
  {
    timestamps: true,
  }
);
```

### Payment Methods

- `cash` - Cash payments
- `credit_card` - Credit card transactions
- `debit_card` - Debit card transactions
- `bank_transfer` - Bank transfers
- `digital_wallet` - Digital wallet payments (PayPal, Venmo, etc.)
- `check` - Check payments
- `other` - Other payment methods

---

## 🗂️ Database Indexes

### ExpenseType Indexes

```javascript
expenseTypeSchema.index({ name: 1 });
expenseTypeSchema.index({ isActive: 1 });
```

### Expense Indexes

```javascript
expenseSchema.index({ date: -1 }); // Most recent first
expenseSchema.index({ typeId: 1, date: -1 });
expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ amount: 1 });
expenseSchema.index({ isDeleted: 1 });
expenseSchema.index({ tags: 1 });
expenseSchema.index({ paymentMethod: 1 });

// Compound indexes
expenseSchema.index({ isDeleted: 1, date: -1 });
expenseSchema.index({ category: 1, isDeleted: 1, date: -1 });
```

---

## 🔌 Database Setup

### Prerequisites

1. **MongoDB** installed locally or access to MongoDB Atlas
2. **Node.js** (v18+ recommended)
3. **npm** or **yarn**

### Local MongoDB Setup

1. **Install MongoDB**

   ```bash
   # Windows (using Chocolatey)
   choco install mongodb

   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community

   # Ubuntu
   sudo apt install mongodb
   ```

2. **Start MongoDB Service**

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo service mongod start
   ```

3. **Verify Connection**
   ```bash
   mongo --eval 'db.runCommand({ connectionStatus: 1 })'
   ```

### MongoDB Atlas Setup (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user and password
4. Whitelist your IP address
5. Get connection string

---

## ⚙️ Environment Configuration

### .env Setup

Copy `.env.example` to `.env` and configure:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# Server Configuration
PORT=3000
NODE_ENV=development

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

### Installation & Startup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

---

## 📡 API Endpoints

### Health Check

```
GET /health
```

### ExpenseTypes

```
GET    /api/expense-types           # Get all active expense types
GET    /api/expense-types/:id       # Get expense type by ID
POST   /api/expense-types           # Create new expense type
PUT    /api/expense-types/:id       # Update expense type
DELETE /api/expense-types/:id       # Soft delete expense type
```

### Expenses

```
GET    /api/expenses                # Get all expenses with filters
GET    /api/expenses/:id            # Get expense by ID
POST   /api/expenses                # Create new expense
PUT    /api/expenses/:id            # Update expense
DELETE /api/expenses/:id            # Soft delete expense
GET    /api/expenses/summary        # Get expense summary/analytics
```

---

## 🚀 Usage Examples

### Creating an Expense

```typescript
import { Expense } from "./models/Expense.js";

const newExpense = new Expense({
  amount: 25.99,
  description: "Lunch at cafe",
  category: "Food & Dining",
  date: new Date(),
  typeId: "648a8d2c1234567890abcdef",
  tags: ["work", "lunch"],
  paymentMethod: "credit_card",
});

await newExpense.save();
```

### Querying Expenses

```typescript
// Get recent expenses
const recentExpenses = await Expense.findActive();

// Get expenses by date range
const monthlyExpenses = await Expense.findByDateRange(
  new Date("2024-01-01"),
  new Date("2024-01-31")
);

// Get expense summary by category
const summary = await Expense.getTotalByCategory();
```

### Aggregation Examples

```typescript
// Monthly totals
const monthlyTotals = await Expense.getMonthlyTotals(2024);

// Category breakdown
const categoryBreakdown = await Expense.getTotalByCategory();

// Expense summary with filters
const summary = await getExpenseSummary({
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
  category: "Food & Dining",
});
```

---

## 🛠️ Development

### Project Structure

```
server/
├── src/
│   ├── models/
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── ExpenseType.ts     # ExpenseType model
│   │   └── Expense.ts         # Expense model
│   └── index.ts               # Main server file
├── dist/                      # Compiled JavaScript
├── .env.example               # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

```bash
npm run build     # Compile TypeScript
npm run dev       # Development with auto-reload
npm start         # Production server
```

---

## 📝 Notes

- All monetary amounts are stored as numbers with 2 decimal precision
- Soft deletion is used for data integrity (isDeleted flag)
- Timestamps are automatically managed by Mongoose
- All responses exclude `_id` and `__v` fields via transform functions
- Validation is enforced at both schema and application levels

---

## 📋 ExpenseType Model

### Schema Definition

```typescript
{
  name: String,         // Required, unique, 2-50 chars
  description: String,  // Optional, max 200 chars
  color: String,        // Hex color code, default #6B7280
  icon: String,         // Icon name, max 50 chars
  isActive: Boolean     // Default true
}
```

### Validation Rules

- **name**: Required, unique, trimmed, 2-50 characters
- **description**: Optional, trimmed, max 200 characters
- **color**: Must be valid hex color (`#FFFFFF` or `#FFF`)
- **icon**: Optional, max 50 characters
- **isActive**: Boolean, defaults to `true`

### Default Expense Types

```javascript
[
  { name: "Food & Dining", color: "#EF4444", icon: "utensils" },
  { name: "Transportation", color: "#3B82F6", icon: "car" },
  { name: "Housing", color: "#10B981", icon: "home" },
  { name: "Utilities", color: "#F59E0B", icon: "zap" },
  { name: "Entertainment", color: "#8B5CF6", icon: "film" },
  { name: "Healthcare", color: "#EF4444", icon: "heart" },
  { name: "Shopping", color: "#F97316", icon: "shopping-bag" },
  { name: "Other", color: "#6B7280", icon: "more-horizontal" },
];
```

### Static Methods

#### `findActive()`

Returns all active expense types, sorted by name.

```javascript
const activeTypes = await ExpenseType.findActive();
// Returns: [{ name: 'Food & Dining', isActive: true, ... }, ...]
```

#### `findByName(name)`

Finds expense type by name (case-insensitive).

```javascript
const foodType = await ExpenseType.findByName("food");
// Returns: { name: 'Food & Dining', ... }
```

### Instance Methods

#### `deactivate()`

Soft deactivates an expense type.

```javascript
const type = await ExpenseType.findById(typeId);
await type.deactivate();
// Sets isActive: false
```

#### `activate()`

Reactivates an expense type.

```javascript
await type.activate();
// Sets isActive: true
```

---

## 💰 Expense Model

### Schema Definition

```typescript
{
  amount: Number,           // Required, 0.01-999999.99, 2 decimals
  description: String,      // Required, 1-500 chars
  typeId: String,          // Required, references ExpenseType
  date: Date,              // Required, defaults to now
  category: String,        // Optional, max 100 chars
  tags: [String],          // Array of strings, max 50 chars each
  receipt: {               // Optional receipt attachment
    url: String,
    filename: String
  },
  userId: String,          // Optional (for future auth)
  isDeleted: Boolean       // Soft delete, default false
}
```

### Advanced Validation

#### Amount Validation

```javascript
amount: {
  type: Number,
  required: [true, 'Amount is required'],
  min: [0.01, 'Amount must be greater than 0'],
  max: [999999.99, 'Amount cannot exceed $999,999.99'],
  validate: {
    validator: function(value) {
      return Number.isInteger(value * 100) // Only 2 decimal places
    },
    message: 'Amount can only have up to 2 decimal places'
  }
}
```

#### Date Validation

```javascript
date: {
  validate: {
    validator: function(date) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return date <= tomorrow // Max 1 day in future
    },
    message: 'Date cannot be more than 1 day in the future'
  }
}
```

### Static Methods

#### `findByUser(userId)`

Gets all expenses for a user, sorted by date (newest first).

```javascript
const expenses = await Expense.findByUser("user123");
// Returns populated expenses with type information
```

#### `findByDateRange(startDate, endDate, userId?)`

Filters expenses by date range.

```javascript
const start = new Date("2025-01-01");
const end = new Date("2025-01-31");
const januaryExpenses = await Expense.findByDateRange(start, end, "user123");
```

#### `findByType(typeId, userId?)`

Gets all expenses of a specific type.

```javascript
const foodExpenses = await Expense.findByType("food-type-id", "user123");
```

#### `getTotalsByType(userId?, startDate?, endDate?)`

Advanced aggregation for expense summaries.

```javascript
const summary = await Expense.getTotalsByType("user123");
/* Returns:
[
  {
    typeId: 'food-id',
    typeName: 'Food & Dining',
    totalAmount: 456.78,
    count: 23,
    avgAmount: 19.86
  },
  ...
]
*/
```

### Instance Methods

#### `softDelete()` & `restore()`

Soft delete functionality for data recovery.

```javascript
const expense = await Expense.findById(expenseId);
await expense.softDelete(); // Sets isDeleted: true
await expense.restore(); // Sets isDeleted: false
```

#### `addTag(tag)` & `removeTag(tag)`

Tag management methods.

```javascript
await expense.addTag("business"); // Adds if not exists
await expense.removeTag("personal"); // Removes if exists
```

---

## 🔍 Database Indexes

### Single Field Indexes

```javascript
expenseSchema.index({ date: -1 }); // Most recent first
expenseSchema.index({ typeId: 1 }); // Filter by type
expenseSchema.index({ userId: 1 }); // Filter by user
expenseSchema.index({ isDeleted: 1 }); // Exclude deleted
expenseSchema.index({ amount: 1 }); // Sort by amount
expenseSchema.index({ tags: 1 }); // Search by tags
```

### Compound Indexes

```javascript
expenseSchema.index({ userId: 1, date: -1 }); // User's recent expenses
expenseSchema.index({ userId: 1, typeId: 1, date: -1 }); // User's expenses by type
expenseSchema.index({ userId: 1, isDeleted: 1, date: -1 }); // User's active expenses
```

**Performance Impact**: These indexes dramatically improve query speed for common operations like filtering expenses by user, date ranges, and types.

---

## 🛠️ TypeScript Interfaces

### Core Interfaces

```typescript
interface IExpenseType extends Document {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IExpense extends Document {
  _id: string;
  amount: number;
  description: string;
  typeId: string | IExpenseType;
  date: Date;
  category?: string;
  tags?: string[];
  receipt?: {
    url: string;
    filename: string;
  };
  userId?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Response Types

```typescript
interface ExpenseResponse {
  id: string; // Transformed from _id
  amount: number;
  description: string;
  typeId: string;
  type?: ExpenseTypeResponse;
  date: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  // Note: isDeleted, _id, __v are excluded
}
```

---

## ⚙️ Middleware

### Pre-save Middleware

Automatically runs before saving documents:

```javascript
expenseSchema.pre("save", function (next) {
  // Round amount to 2 decimal places
  if (this.isModified("amount")) {
    this.amount = Math.round(this.amount * 100) / 100;
  }

  // Remove duplicate tags
  if (this.isModified("tags")) {
    this.tags = [...new Set(this.tags)];
  }

  next();
});
```

### Transform Functions

Clean up JSON/Object output:

```javascript
toJSON: {
  transform: function(doc, ret) {
    ret.id = ret._id      // Clean ID format
    delete ret._id        // Remove MongoDB ID
    delete ret.__v        // Remove version key
    delete ret.isDeleted  // Hide soft delete flag
    return ret
  }
}
```

---

## 📚 Usage Examples

### Creating Expense Types

```javascript
import { ExpenseType, createDefaultExpenseTypes } from "./models";

// Create default types
await createDefaultExpenseTypes();

// Create custom type
const customType = new ExpenseType({
  name: "Travel",
  description: "Travel and vacation expenses",
  color: "#06B6D4",
  icon: "plane",
});
await customType.save();
```

### Creating Expenses

```javascript
import { Expense } from "./models";

const expense = new Expense({
  amount: 25.5,
  description: "Lunch at restaurant",
  typeId: "food-type-id",
  date: new Date(),
  tags: ["restaurant", "lunch"],
  category: "dining",
});
await expense.save();
```

### Querying Data

```javascript
// Get user's recent expenses
const recentExpenses = await Expense.findByUser("user123");

// Get monthly summary
const startOfMonth = new Date(2025, 0, 1); // January 1st
const endOfMonth = new Date(2025, 0, 31); // January 31st
const monthlySummary = await Expense.getTotalsByType(
  "user123",
  startOfMonth,
  endOfMonth
);

// Search with filters
const foodExpenses = await Expense.find({
  userId: "user123",
  typeId: "food-type-id",
  amount: { $gte: 10, $lte: 50 },
  date: { $gte: startOfMonth },
  isDeleted: false,
}).populate("typeId");
```

### Advanced Aggregations

```javascript
// Monthly spending trends
const monthlyTrends = await Expense.aggregate([
  { $match: { userId: "user123", isDeleted: false } },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
      totalAmount: { $sum: "$amount" },
      count: { $sum: 1 },
      avgExpense: { $avg: "$amount" },
    },
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } },
]);

// Top spending categories
const topCategories = await Expense.aggregate([
  { $match: { userId: "user123", isDeleted: false } },
  { $group: { _id: "$category", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 5 },
]);
```

---

## 🚀 Performance Tips

1. **Use Indexes**: Always query with indexed fields (`userId`, `date`, `typeId`)
2. **Projection**: Only fetch needed fields
3. **Pagination**: Use `limit()` and `skip()` for large datasets
4. **Aggregation**: Use aggregation pipeline for complex calculations
5. **Populate Wisely**: Only populate relationships when needed

### Example Optimized Query

```javascript
// Good: Uses indexes, projection, and pagination
const expenses = await Expense.find({
  userId: "user123", // Indexed
  date: { $gte: startDate }, // Indexed
  isDeleted: false, // Indexed
})
  .select("amount description date typeId") // Only needed fields
  .populate("typeId", "name color") // Limited population
  .sort({ date: -1 }) // Uses index
  .limit(20) // Pagination
  .skip(page * 20);
```

---

## 🔒 Security Considerations

1. **Soft Deletes**: Use `isDeleted` flag instead of permanent deletion
2. **User Isolation**: Always filter by `userId` in multi-user scenarios
3. **Input Validation**: All inputs are validated at schema level
4. **Data Sanitization**: `trim: true` removes unwanted whitespace
5. **Type Safety**: TypeScript prevents type-related errors

---

## 🧪 Testing Examples

```javascript
// Test expense creation
const expense = new Expense({
  amount: 25.5,
  description: "Test expense",
  typeId: "test-type-id",
});
await expense.save();
expect(expense.amount).toBe(25.5);

// Test validation
const invalidExpense = new Expense({
  amount: -5, // Should fail validation
  description: "Invalid",
});
await expect(invalidExpense.save()).rejects.toThrow();

// Test soft delete
await expense.softDelete();
expect(expense.isDeleted).toBe(true);
```

---

This schema design provides a solid foundation for a scalable expense tracking application with room for future enhancements like user authentication, receipt uploads, budgeting features, and advanced analytics.
