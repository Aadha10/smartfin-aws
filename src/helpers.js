// Simulate a wait time with random delay
export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// Generate random colors based on existing budgets
const generateRandomColor = (userId) => {
  const existingBudgetLength = fetchData("budgets", userId)?.length ?? 0;
  return `${existingBudgetLength * 34} 65% 50%`;
};

// Fetch data for a specific key and user from localStorage
export const fetchData = (key, userId) => {
  return JSON.parse(localStorage.getItem(`${key}_${userId}`));
};

// Get all matching items based on a specific key-value pair for a user
export const getAllMatchingItems = ({ category, key, value, userId }) => {
  const data = fetchData(category, userId) ?? [];
  return data.filter((item) => item[key] === value);
};

// Delete an item by id for a specific user from localStorage
export const deleteItem = ({ key, id, userId }) => {
  const existingData = fetchData(key, userId);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(`${key}_${userId}`, JSON.stringify(newData));
  }
  return localStorage.removeItem(`${key}_${userId}`);
};

// Create a new budget for a specific user
export const createBudget = ({ name, amount, userId }) => {
  if (!userId) {
    throw new Error("User ID is missing");
  }
  if (!name || !amount) {
    throw new Error("Invalid budget data");
  }
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    color: generateRandomColor(userId), // Use user-specific color scheme
  };
  const existingBudgets = fetchData("budgets", userId) ?? [];
  return localStorage.setItem(
    `budgets_${userId}`,
    JSON.stringify([...existingBudgets, newItem])
  );
};

// Create a new expense for a specific budget and user
export const createExpense = ({ name, amount, budgetId, userId }) => {
  if (!userId) {
    throw new Error("User ID is missing");
  }
  if (!name || !amount || !budgetId) {
    throw new Error("Invalid expense data");
  }
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    budgetId: budgetId,
  };
  const existingExpenses = fetchData("expenses", userId) ?? [];
  return localStorage.setItem(
    `expenses_${userId}`,
    JSON.stringify([...existingExpenses, newItem])
  );
};

// Calculate the total spent by a specific budget for a user
export const calculateSpentByBudget = (budgetId, userId) => {
  const expenses = fetchData("expenses", userId) ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // Check if the expense belongs to the given budgetId
    if (expense.budgetId !== budgetId) return acc;

    // Add the current expense amount to the total
    return acc + expense.amount;
  }, 0);
  return budgetSpent;
};

// Formatting helpers
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};
