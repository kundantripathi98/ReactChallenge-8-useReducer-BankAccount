import { useReducer } from "react";
import "./styles.css";
/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  depositMoney: 0,
  withdrawMoney: 0,
  balance: 0,
  loan: 0,
  isActive: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "openAccount": {
      return { ...state, isActive: true, balance: 500 };
    }
    case "depositMoney": {
      return { ...state, depositMoney: action.payLoad };
    }
    case "withdrawMoney": {
      return {
        ...state,
        withdrawMoney: action.payLoad,
      };
    }
    case "deposit": {
      return {
        ...state,
        balance: state.balance + action.payLoad,
        depositMoney: 0,
      };
    }
    case "withdraw": {
      return {
        ...state,
        balance:
          state.balance === 0 || state.balance < state.withdrawMoney
            ? state.balance
            : state.balance - action.payLoad,
        withdrawMoney:
          state.balance < state.withdrawMoney ? state.withdrawMoney : 0,
      };
    }
      
    case "requestLoan": {
      return {
        ...state,
        loan: action.payLoad,
        balance: state.loan ? state.balance : state.balance + action.payLoad,
      };
    }
      
    case "payLoan": {
      return {
        ...state,
        loan: 0,
        balance: state.loan ? state.balance - action.payLoad : state.balance,
      };
    }
      
    case "closeAccount": {
      return {
        ...state,
        withdrawMoney: 0,
        depositMoney: 0,
        isActive:
          state.balance === 0 && state.loan === 0 ? false : state.isActive,
      };
    }
  }
}

export default function App() {
  const [state, dispatcher] = useReducer(reducer, initialState);
  const { depositMoney, withdrawMoney, balance, loan, isActive } = state;
  // console.log(100 < 50);

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => dispatcher({ type: "openAccount" })}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
            
      <p>
        <input
          type="number"
          value={depositMoney}
          disabled={!isActive}
          onChange={(e) =>
            dispatcher({
              type: "depositMoney",
              payLoad: Number(e.target.value),
            })
          }
        />
        <button
          onClick={() => dispatcher({ type: "deposit", payLoad: depositMoney })}
          disabled={!isActive}
        >
          Deposit the money
        </button>
      </p>
      <p>
        <input
          type="number"
          value={withdrawMoney}
          disabled={!isActive}
          onChange={(e) =>
            dispatcher({
              type: "withdrawMoney",
              payLoad: Number(e.target.value),
            })
          }
        />
        <button
          onClick={() =>
            dispatcher({ type: "withdraw", payLoad: withdrawMoney })
          }
          disabled={!isActive}
        >
          Withdraw the money
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatcher({ type: "requestLoan", payLoad: 5000 })}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatcher({ type: "payLoan", payLoad: 5000 })}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatcher({ type: "closeAccount" })}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}
