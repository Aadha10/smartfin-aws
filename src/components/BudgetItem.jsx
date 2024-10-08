// rrd imports
import { Form, Link } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
// library imports
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";

// helper functions
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";

const BudgetItem = ({ budget, showDelete = false, onDelete }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const userId = user.userId;
  const { id, name, amount, color } = budget;
  const spent = calculateSpentByBudget(id, userId);

  const handleDelete = async (event) => {
    event.preventDefault();
    if (confirm("Are you sure you want to permanently delete this budget?")) {
      try {
        await onDelete(id); // Call the onDelete function passed as a prop
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    }
  };

  return (
    <div
      className="budget"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>
      <progress max={amount} value={spent}>
        {formatPercentage(spent / amount)}
      </progress>
      <div className="progress-text">
        <small>{formatCurrency(spent)} spent</small>
        <small>{formatCurrency(amount - spent)} remaining</small>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <button type="button" className="btn" onClick={handleDelete}>
            <span>Delete Budget</span>
            <TrashIcon width={20} />
          </button>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/budget/${id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetItem;
