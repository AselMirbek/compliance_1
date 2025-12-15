import { Customer, ConsistencyMatch, HistoryEntry } from '../types'
import './CustomerDetailModal.css'

interface CustomerDetailModalProps {
  customer: Customer
  onClose: () => void
  onEdit: (customer: Customer) => void
  onDelete: (uqId: string) => void
  consistencyMatches: ConsistencyMatch[]
  history: HistoryEntry[]
}

export default function CustomerDetailModal({
  customer,
  onClose,
  onEdit,
  onDelete,
  consistencyMatches,
  history,
}: CustomerDetailModalProps) {
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      onDelete(customer.uqId)
    }
  }

  const handleDeleteMatch = (matchUqId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это совпадение?')) {
      alert(`Удаление совпадения ${matchUqId} будет реализовано`)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Детали клиента</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <section className="detail-section">
            <h3>Основные данные</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name:</label>
                <span>{customer.name}</span>
              </div>
              {customer.customerId && (
                <div className="detail-item">
                  <label>Customer ID:</label>
                  <span>{customer.customerId}</span>
                </div>
              )}
              {customer.customerNumber && (
                <div className="detail-item">
                  <label>Customer Number:</label>
                  <span>{customer.customerNumber}</span>
                </div>
              )}
            </div>
          </section>

          <section className="detail-section">
            <h3>Персональные данные</h3>
            <div className="detail-grid">
              {customer.passport && (
                <div className="detail-item">
                  <label>Паспорт:</label>
                  <span>{customer.passport}</span>
                </div>
              )}
              {customer.identificationData && (
                <div className="detail-item">
                  <label>Идентификационные данные:</label>
                  <span>{customer.identificationData}</span>
                </div>
              )}
              {customer.otherData && (
                <div className="detail-item">
                  <label>Иные данные:</label>
                  <span>{customer.otherData}</span>
                </div>
              )}
            </div>
          </section>

          <section className="detail-section">
            <h3>Consistency Data</h3>
            {consistencyMatches.length > 0 ? (
              <div className="consistency-table">
                <table>
                  <thead>
                    <tr>
                      <th>UQ ID</th>
                      <th>Name</th>
                      <th>Match</th>
                      <th>Source</th>
                      <th>Actions</th>
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
                        <td>
                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleDeleteMatch(match.uqId)}
                          >
                            Delete Match
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">Нет совпадений</p>
            )}
          </section>

          <section className="detail-section">
            <h3>History</h3>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-date">{entry.date}</div>
                    <div className="history-user">{entry.user}</div>
                    <div className="history-action">{entry.action}</div>
                    <div className="history-changes">{entry.changes}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Нет истории изменений</p>
            )}
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => onEdit(customer)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

