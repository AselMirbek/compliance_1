import { Customer } from '../types'
import './GeneralListTable.css'

interface GeneralListTableProps {
  customers: Customer[]
  onViewEdit: (customer: Customer) => void
}

export default function GeneralListTable({
  customers,
  onViewEdit,
}: GeneralListTableProps) {
  return (
    <div className="table-container">
      <table className="general-list-table">
        <thead>
          <tr>
            <th>UQ ID</th>
            <th>Name</th>
            <th>Search Name</th>
            <th>Customer Name</th>
            <th>Created Date</th>
            <th>Created User</th>
            <th>Origin Source</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={9} className="empty-state">
                Нет данных для отображения
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.uqId}>
                <td>{customer.uqId}</td>
                <td>{customer.name}</td>
                <td>{customer.searchName}</td>
                <td>{customer.customerName}</td>
                <td>{customer.createdDate}</td>
                <td>{customer.createdUser}</td>
                <td>{customer.originSource}</td>
                <td>{customer.type}</td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => onViewEdit(customer)}
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

