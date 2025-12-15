import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SourceType, StatusType, Customer } from '../types'
import { mockCustomers, getConsistencyMatches, getHistory } from '../data/mockData'
import { useRole } from '../contexts/RoleContext'
import GeneralListTable from '../components/GeneralListTable'
import GeneralListFilters from '../components/GeneralListFilters'
import CustomerDetailModal from '../components/CustomerDetailModal'
import './GeneralList.css'

export default function GeneralList() {
  const { role } = useRole()
  const navigate = useNavigate()
  const [searchName, setSearchName] = useState('')
  const [source, setSource] = useState<SourceType | 'All'>('All')
  const [status, setStatus] = useState<StatusType | 'All'>('All')
  const [originSource, setOriginSource] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)

  const handleSearch = () => {
    // Фильтрация будет происходить автоматически через состояние
  }

  const handleViewEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailModalOpen(true)
  }

  const handleExport = () => {
    // Логика экспорта в Excel
    alert('Экспорт в Excel будет реализован')
  }

  const filteredCustomers = customers.filter((customer) => {
    if (searchName && !customer.searchName.includes(searchName.toUpperCase())) {
      return false
    }
    if (source !== 'All' && customer.source !== source) {
      return false
    }
    if (status !== 'All' && customer.status !== status) {
      return false
    }
    if (originSource && customer.originSource !== originSource) {
      return false
    }
    if (dateFrom && customer.createdDate < dateFrom) {
      return false
    }
    if (dateTo && customer.createdDate > dateTo) {
      return false
    }
    return true
  })

  return (
    <div className="general-list">
      <div className="general-list-header">
        <h2>General List</h2>
        {role === 'Approval' ? (
          <Link to="/applications" className="btn btn-primary add-btn">
            Заявки
          </Link>
        ) : (
          <button
            className="btn btn-primary add-btn"
            onClick={() => navigate('/customer-check')}
          >
            + Add
          </button>
        )}
      </div>

      <GeneralListFilters
        searchName={searchName}
        setSearchName={setSearchName}
        source={source}
        setSource={setSource}
        status={status}
        setStatus={setStatus}
        originSource={originSource}
        setOriginSource={setOriginSource}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onSearch={handleSearch}
        onExport={handleExport}
      />

      <GeneralListTable
        customers={filteredCustomers}
        onViewEdit={handleViewEdit}
      />

      {isDetailModalOpen && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedCustomer(null)
          }}
          onEdit={(updatedCustomer) => {
            setCustomers(
              customers.map((c) =>
                c.uqId === updatedCustomer.uqId ? updatedCustomer : c
              )
            )
          }}
          onDelete={(uqId) => {
            setCustomers(customers.filter((c) => c.uqId !== uqId))
            setIsDetailModalOpen(false)
          }}
          consistencyMatches={getConsistencyMatches(selectedCustomer.uqId)}
          history={getHistory(selectedCustomer.uqId)}
        />
      )}
    </div>
  )
}

