import { useState } from 'react'
import { Application, ApplicationStatus } from '../types'
import { mockApplications, getConsistencyMatches } from '../data/mockData'
import TransactionDetailModal from '../components/TransactionDetailModal'
import './Applications.css'

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All')

  const handleView = (application: Application) => {
    setSelectedApplication(application)
    setIsDetailModalOpen(true)
  }

  const handleApprove = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: 'approved' as ApplicationStatus } : app
      )
    )
    alert(`Заявка ${id} подтверждена`)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
  }

  const handleReject = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: 'rejected' as ApplicationStatus } : app
      )
    )
    alert(`Заявка ${id} отклонена`)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
  }

  const filteredApplications = applications.filter((application) => {
    if (statusFilter !== 'All' && application.status !== statusFilter) {
      return false
    }
    return true
  })

  const pendingCount = applications.filter((app) => app.status === 'pending').length
  const approvedCount = applications.filter((app) => app.status === 'approved').length

  return (
    <div className="applications-page">
      <div className="page-header">
        <h2>Заявки</h2>
        <div className="status-filters">
          <button
            className={`status-filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            Все ({applications.length})
          </button>
          <button
            className={`status-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`status-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Transaction No</th>
              <th>Customer No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Match</th>
              <th>Created Date</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-state">
                  Нет заявок для отображения
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.transactionNo}</td>
                  <td>{application.customerNo}</td>
                  <td>{application.name}</td>
                  <td>
                    <span
                      className={`type-badge ${
                        application.type === 'Insert' ? 'insert' : 'delete'
                      }`}
                    >
                      {application.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${application.status}`}>
                      {application.status === 'pending' ? 'Pending' : 
                       application.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </td>
                  <td>
                    {application.match !== undefined ? (
                      <span
                        className={`match-badge ${
                          application.match === 100 ? 'full-match' : ''
                        }`}
                      >
                        {application.match}%
                      </span>
                    ) : (
                      <span className="no-match">-</span>
                    )}
                  </td>
                  <td>{application.createdDate}</td>
                  <td>{application.user}</td>
                  <td>
                    {application.status === 'pending' && (
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-approve"
                          onClick={() => handleApprove(application.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-action btn-reject"
                          onClick={() => handleReject(application.id)}
                        >
                          Reject
                        </button>
                        <button
                          className="btn-action"
                          onClick={() => handleView(application)}
                        >
                          View
                        </button>
                      </div>
                    )}
                    {application.status !== 'pending' && (
                      <button
                        className="btn-action"
                        onClick={() => handleView(application)}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedApplication && (
        <TransactionDetailModal
          transaction={{
            transactionNo: selectedApplication.transactionNo,
            customerNo: selectedApplication.customerNo,
            name: selectedApplication.name,
            type: selectedApplication.type,
            match: selectedApplication.match,
            createdDate: selectedApplication.createdDate,
            user: selectedApplication.user,
            source: selectedApplication.source,
            customer: selectedApplication.customer,
          }}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedApplication(null)
          }}
          onApprove={() => handleApprove(selectedApplication.id)}
          onReject={() => handleReject(selectedApplication.id)}
          consistencyMatches={getConsistencyMatches(selectedApplication.customerNo)}
        />
      )}
    </div>
  )
}

