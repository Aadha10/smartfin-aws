import { useEffect, useRef } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

const AddBudgetForm = ({ onAction }) => {
  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    formRef.current.reset();
    focusRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBudget = e.target.newBudget.value;
    const newBudgetAmount = e.target.newBudgetAmount.value;

    // Call onAction with the form values
    onAction({ newBudget, newBudgetAmount });
  };

  return (
    <div className="form-wrapper">
      <h2 className="h3">Create Budget</h2>
      <form className="grid-sm" ref={formRef} onSubmit={handleSubmit}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Groceries"
            required
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="e.g., $350"
            required
          />
        </div>
        <button type="submit" className="btn btn--dark">
          <span>Create budget</span>
          <CurrencyDollarIcon width={20} />
        </button>
      </form>
    </div>
  );
};

export default AddBudgetForm;
