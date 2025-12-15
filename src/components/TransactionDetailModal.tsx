import { Transaction, ConsistencyMatch } from '../types'
import './TransactionDetailModal.css'

interface TransactionDetailModalProps {
  transaction: Transaction
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  consistencyMatches: ConsistencyMatch[]
}

export default function TransactionDetailModal({
  transaction,
  onClose,
  onApprove,
  onReject,
  consistencyMatches,
}: TransactionDetailModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Transaction Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <section className="detail-section">
            <h3>Transaction Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Transaction No:</label>
                <span>{transaction.transactionNo}</span>
              </div>
              <div className="detail-item">
                <label>Customer No:</label>
                <span>{transaction.customerNo}</span>
              </div>
              <div className="detail-item">
                <label>Name:</label>
                <span>{transaction.name}</span>
              </div>
              <div className="detail-item">
                <label>Type:</label>
                <span
                  className={`type-badge ${
                    transaction.type === 'Insert' ? 'insert' : 'delete'
                  }`}
                >
                  {transaction.type}
                </span>
              </div>
              {transaction.match !== undefined && (
                <div className="detail-item">
                  <label>Match:</label>
                  <span
                    className={`match-badge ${
                      transaction.match === 100 ? 'full-match' : ''
                    }`}
                  >
                    {transaction.match}%
                  </span>
                </div>
              )}
              <div className="detail-item">
                <label>Created Date:</label>
                <span>{transaction.createdDate}</span>
              </div>
              <div className="detail-item">
                <label>User:</label>
                <span>{transaction.user}</span>
              </div>
              <div className="detail-item">
                <label>Source:</label>
                <span>{transaction.source}</span>
              </div>
            </div>
          </section>

          {consistencyMatches.length > 0 && (
            <section className="detail-section">
              <h3>Similar Duplicates</h3>
              <div className="consistency-table">
                <table>
                  <thead>
                    <tr>
                      <th>UQ ID</th>
                      <th>Name</th>
                      <th>Match</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consistencyMatches.map((match) => (
                      <tr key={match.uqId}>
                        <td>{match.uqId}</td>
                        <td>{match.name}</td>
                        <td>
                          <span
                            className={`match-badge ${
                              match.matchPercentage >= 80
                                ? 'high'
                                : match.matchPercentage >= 60
                                ? 'medium'
                                : 'low'
                            }`}
                          >
                            {match.matchPercentage}%
                          </span>
                        </td>
                        <td>{match.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {transaction.customer && (
            <section className="detail-section">
              <h3>Customer Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Customer ID:</label>
                  <span>{transaction.customer.customerId || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Customer Number:</label>
                  <span>{transaction.customer.customerNumber || '-'}</span>
                </div>
                {transaction.customer.passport && (
                  <div className="detail-item">
                    <label>Passport:</label>
                    <span>{transaction.customer.passport}</span>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger" onClick={onReject}>
            Reject
          </button>
          <button className="btn btn-success" onClick={onApprove}>
            Approve
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

