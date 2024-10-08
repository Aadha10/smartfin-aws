import { useEffect, useRef } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const AddExpenseForm = ({ budgets, onAction }) => {
  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    formRef.current.reset();
    focusRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = e.target.newExpense.value;
    const newExpenseAmount = e.target.newExpenseAmount.value;
    const newExpenseBudget = budgets.length === 1 
      ? budgets[0].id 
      : e.target.newExpenseBudget.value;

    // Call onAction with form values
    onAction({ newExpense, newExpenseAmount, newExpenseBudget });
  };

  return (
    <div className="form-wrapper">
      <h2 className="h3">Add New {budgets.length === 1 && `${budgets[0].name}`} Expense</h2>
      <form className="grid-sm" ref={formRef} onSubmit={handleSubmit}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50"
              required
            />
          </div>
        </div>
        {budgets.length > 1 && (
          <div className="grid-xs">
            <label htmlFor="newExpenseBudget">Budget Category</label>
            <select name="newExpenseBudget" id="newExpenseBudget" required>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="btn btn--dark">
          <span>Add Expense</span>
          <PlusCircleIcon width={20} />
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
