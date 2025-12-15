import { useState } from 'react'
import { Transaction } from '../types'
import { mockTransactions, getConsistencyMatches } from '../data/mockData'
import TransactionDetailModal from '../components/TransactionDetailModal'
import './TransactionTable.css'

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailModalOpen(true)
  }

  const handleApprove = (transactionNo: string) => {
    setTransactions(
      transactions.filter((t) => t.transactionNo !== transactionNo)
    )
    alert(`Транзакция ${transactionNo} подтверждена`)
  }

  const handleReject = (transactionNo: string) => {
    setTransactions(
      transactions.filter((t) => t.transactionNo !== transactionNo)
    )
    alert(`Транзакция ${transactionNo} отклонена`)
  }

  return (
    <div className="transaction-table-page">
      <div className="page-header">
        <h2>Transaction Table</h2>
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction No</th>
              <th>Customer No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Match</th>
              <th>Created Date</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  Нет транзакций для отображения
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.transactionNo}>
                  <td>{transaction.transactionNo}</td>
                  <td>{transaction.customerNo}</td>
                  <td>{transaction.name}</td>
                  <td>
                    <span
                      className={`type-badge ${
                        transaction.type === 'Insert' ? 'insert' : 'delete'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td>
                    {transaction.match !== undefined ? (
                      <span
                        className={`match-badge ${
                          transaction.match === 100 ? 'full-match' : ''
                        }`}
                      >
                        {transaction.match}%
                      </span>
                    ) : (
                      <span className="no-match">-</span>
                    )}
                  </td>
                  <td>{transaction.createdDate}</td>
                  <td>{transaction.user}</td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleView(transaction)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedTransaction(null)
          }}
          onApprove={() => {
            handleApprove(selectedTransaction.transactionNo)
            setIsDetailModalOpen(false)
          }}
          onReject={() => {
            handleReject(selectedTransaction.transactionNo)
            setIsDetailModalOpen(false)
          }}
          consistencyMatches={getConsistencyMatches(selectedTransaction.customerNo)}
        />
      )}
    </div>
  )
}

