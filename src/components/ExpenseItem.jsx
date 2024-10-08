// rrd imports
import { Link, useFetcher } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
// library import
import { TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
  deleteItem,
} from "../helpers";

const ExpenseItem = ({ expense, showBudget, onDelete }) => {
  console.log("ExpenseItem onDelete prop:", onDelete); // This should log the function
  console.log("Is onDelete a function?", typeof onDelete === 'function');

  const fetcher = useFetcher();
  const { user } = useAuthenticator((context) => [context.user]);
  const userId = user.userId;
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const fetchBudget = async () => {
      const fetchedBudget = await getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: expense.budgetId,
        userId,
      });
      if (fetchedBudget.length > 0) {
        setBudget(fetchedBudget[0]);
      }
    };

    fetchBudget();
  }, [expense.budgetId, userId]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirm(`Are you sure you want to delete the expense "${expense.name}"?`)) {
      try {
        console.log("Deleting expense with ID:", expense.id);
        await deleteItem({
          key: "expenses",
          id: expense.id,
          userId,
        });
      //   const updatedExpenses = await fetchData("expenses", userId);
      // setExpenses(updatedExpenses);

        // Show the toast message
        window.location.reload();
        toast.success("Expense deleted!");
      } catch (error) {
        console.error("Error during deletion:", error); // Log any errors
      }
    }
  };

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.createdAt)}</td>
      {showBudget && budget && (
        <td>
          <Link to={`/budget/${budget.id}`}>{budget.name}</Link>
        </td>
      )}
      <td>
        <button
          type="button"
          className="btn btn--warning"
          onClick={handleDelete}
          aria-label={`Delete ${expense.name} expense`}
        >
          <TrashIcon width={20} />
        </button>
      </td>
    </>
  );
};

export default ExpenseItem;
