import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'
import { CustomerCheckEntry, Customer, SourceType, TransactionType } from '../types'
import { mockCustomers, getConsistencyMatches, getHistory } from '../data/mockData'
import CustomerDetailModal from '../components/CustomerDetailModal'
import ImportCustomersModal from '../components/ImportCustomersModal'
import './CustomerCheckPage.css'

type OriginSourceType = 'customer' | 'bic' | 'company' | 'country' | 'national' | 'black' | 'other' | ''

type SortField = 'txNo' | 'name' | 'customerNo' | 'source' | 'transactionType' | 'originSource' | 'createdDate' | 'createdUser'
type SortDirection = 'asc' | 'desc'

export default function CustomerCheckPage() {
  const navigate = useNavigate()
  const { role } = useRole()
  const [entries, setEntries] = useState<CustomerCheckEntry[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentTxNo, setCurrentTxNo] = useState<string>('')

  // Form state
  const [source, setSource] = useState<SourceType>('White List')
  const [transactionType, setTransactionType] = useState<TransactionType>('Insert')
  const [originSource, setOriginSource] = useState<OriginSourceType>('')
  const [listGroup, setListGroup] = useState('')
  const [searchName, setSearchName] = useState('')

  // Table selection state - using entry keys instead of indices
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Table filters state - only search
  const [tableSearchText, setTableSearchText] = useState('')

  // Column filters state
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    customerNo: '',
    source: '' as SourceType | '',
  })

  // Table sorting state
  const [sortField, setSortField] = useState<SortField>('createdDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Генерируем TX номер при загрузке страницы
  useEffect(() => {
    generateTxNo()
  }, [])

  const generateTxNo = () => {
    const txNo = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setCurrentTxNo(txNo)
  }


  const handleView = (entry: CustomerCheckEntry) => {
    const customer = mockCustomers.find(
      (c) => c.customerNumber === entry.customerNo || c.customerId === entry.customerNo
    )
    if (customer) {
      setSelectedCustomer(customer)
      setIsDetailModalOpen(true)
    }
  }

  const handleEdit = (entry: CustomerCheckEntry) => {
    const customer = mockCustomers.find(
      (c) => c.customerNumber === entry.customerNo || c.customerId === entry.customerNo
    )
    if (customer) {
      setSelectedCustomer(customer)
      setIsDetailModalOpen(true)
    }
  }

  const handleRemoveEntry = (index: number) => {
    const entryToRemove = entries[index]
    if (entryToRemove) {
      const entryKey = getEntryKey(entryToRemove)
      setEntries(entries.filter((_, i) => i !== index))
      setSelectedEntries(prev => {
        const newSet = new Set(prev)
        newSet.delete(entryKey)
        return newSet
      })
    }
  }

  // Helper to generate unique key for entry
  const getEntryKey = (entry: CustomerCheckEntry) => `${entry.txNo}-${entry.customerNo}-${entry.createdDate}`

  // Selection handlers
  const handleToggleSelect = (entry: CustomerCheckEntry) => {
    const key = getEntryKey(entry)
    setSelectedEntries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedEntries.size === filteredAndSortedEntries.length && 
        filteredAndSortedEntries.every(e => selectedEntries.has(getEntryKey(e)))) {
      setSelectedEntries(new Set())
    } else {
      setSelectedEntries(new Set(filteredAndSortedEntries.map(e => getEntryKey(e))))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedEntries.size === 0) {
      alert('Выберите записи для удаления')
      return
    }

    if (confirm(`Удалить ${selectedEntries.size} выбранных записей?`)) {
      setEntries(prev => prev.filter(entry => !selectedEntries.has(getEntryKey(entry))))
      setSelectedEntries(new Set())
    }
  }

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle import from modal
  const handleImportFromModal = (importedEntries: CustomerCheckEntry[]) => {
    // Check for duplicates
    const existingCustomerNos = new Set(entries.map(e => e.customerNo))
    const newEntries = importedEntries.filter(e => !existingCustomerNos.has(e.customerNo))
    
    if (newEntries.length < importedEntries.length) {
      const duplicateCount = importedEntries.length - newEntries.length
      alert(`${duplicateCount} клиентов уже были добавлены и пропущены`)
    }
    
    if (newEntries.length > 0) {
      setEntries([...entries, ...newEntries])
    }
  }

  // Filtered and sorted entries
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      // Table search filter
      if (tableSearchText) {
        const searchLower = tableSearchText.toLowerCase()
        if (
          !entry.name.toLowerCase().includes(searchLower) &&
          !entry.customerNo.toLowerCase().includes(searchLower) &&
          !entry.txNo.toLowerCase().includes(searchLower) &&
          !entry.searchName.toLowerCase().includes(searchLower)
        ) return false
      }
      
      // Column filters
      if (columnFilters.name && !entry.name.toLowerCase().includes(columnFilters.name.toLowerCase())) return false
      if (columnFilters.customerNo && !entry.customerNo.toLowerCase().includes(columnFilters.customerNo.toLowerCase())) return false
      if (columnFilters.source && entry.source !== columnFilters.source) return false
      
      return true
    })

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'createdDate') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [entries, tableSearchText, columnFilters, sortField, sortDirection])

  const handleSendTransaction = () => {
    const entriesToSend = selectedEntries.size > 0 
      ? filteredAndSortedEntries.filter(e => selectedEntries.has(getEntryKey(e)))
      : filteredAndSortedEntries

    if (entriesToSend.length === 0) {
      alert('Нет клиентов для отправки транзакции')
      return
    }

    // Логика отправки транзакции
    alert(`Транзакция ${currentTxNo} отправлена для ${entriesToSend.length} клиентов`)
    
    // После отправки очищаем таблицу и выбранные записи
    if (selectedEntries.size > 0) {
      setEntries(prev => prev.filter(entry => !selectedEntries.has(getEntryKey(entry))))
      setSelectedEntries(new Set())
    } else {
      setEntries([])
    }
    generateTxNo()
  }

  const handleExportSelected = () => {
    const entriesToExport = selectedEntries.size > 0
      ? filteredAndSortedEntries.filter(e => selectedEntries.has(getEntryKey(e)))
      : filteredAndSortedEntries

    if (entriesToExport.length === 0) {
      alert('Нет данных для экспорта')
      return
    }

    // Экспорт в CSV
    const csvContent = [
      ['TX No', 'Name', 'Customer No', 'Source', 'Transaction Type', 'Origin Source', 'List Group', 'Created Date', 'Created User'].join(','),
      ...entriesToExport.map(entry => [
        entry.txNo,
        entry.name,
        entry.customerNo,
        entry.source,
        entry.transactionType,
        entry.originSource,
        entry.listGroup || '',
        entry.createdDate,
        entry.createdUser
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `customer-check-${currentTxNo}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true)
  }

  return (
    <div className="customer-check-page">
      <div className="page-header">
        <div className="header-top">
          <h2>Проверка клиентов CBS</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Назад
          </button>
        </div>
        <div className="tx-info">
          <span className="tx-label">TX No:</span>
          <span className="tx-value">{currentTxNo}</span>
          <button className="btn btn-link" onClick={generateTxNo}>
            Сгенерировать новый
          </button>
        </div>
      </div>

      {/* Простая форма */}
      <div className="search-section">
        <div className="search-form">
          <div className="form-row fields-row">
            <div className="form-group">
              <label>Source *</label>
              <select
                className="select"
                value={source}
                onChange={(e) => setSource(e.target.value as SourceType)}
              >
                <option value="White List">White List</option>
                <option value="Black List">Black List</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Type *</label>
              <select
                className="select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
              >
                <option value="Insert">Insert</option>
                <option value="Delete">Delete</option>
              </select>
            </div>

            <div className="form-group">
              <label>Origin Source</label>
              <select
                className="select"
                value={originSource}
                onChange={(e) => setOriginSource(e.target.value as OriginSourceType)}
              >
                <option value="">Выберите Origin Source</option>
                <option value="customer">Customer</option>
                <option value="bic">BIC</option>
                <option value="company">Company</option>
                <option value="country">Country</option>
                <option value="national">National</option>
                <option value="black">Black</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Search Name</label>
              <input
                type="text"
                className="input"
                placeholder="Поиск по имени"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {source === 'Black List' && (
              <div className="form-group">
                <label>List Group</label>
                <input
                  type="text"
                  className="input"
                  placeholder="List Group"
                  value={listGroup}
                  onChange={(e) => setListGroup(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="actions-bar">
        <button
          className="btn btn-secondary"
          onClick={handleOpenImportModal}
        >
          Импорт
        </button>
        <button
          className="btn btn-success send-btn"
          onClick={handleSendTransaction}
          disabled={filteredAndSortedEntries.length === 0}
        >
          Отправить транзакцию ({filteredAndSortedEntries.length})
        </button>
      </div>

      {/* Поиск таблицы */}
      <div className="table-filters">
        <div className="filters-header">
          <h4>Поиск</h4>
          <button
            className="btn btn-link btn-clear-filters"
            onClick={() => {
              setTableSearchText('')
              setColumnFilters({ name: '', customerNo: '', source: '' as SourceType | '' })
            }}
          >
            Очистить
          </button>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <input
              type="text"
              className="input"
              placeholder="Поиск по таблице..."
              value={tableSearchText}
              onChange={(e) => setTableSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className="filters-info">
          Показано: {filteredAndSortedEntries.length} из {entries.length} записей
        </div>
      </div>

      {/* Таблица клиентов */}
      <div className="table-container">
        <table className="customer-check-table">
          <thead>
            <tr>
              <th className="select-column">
                <input
                  type="checkbox"
                  checked={filteredAndSortedEntries.length > 0 && 
                    filteredAndSortedEntries.every(e => selectedEntries.has(getEntryKey(e)))}
                  onChange={handleSelectAll}
                  title="Выбрать все"
                />
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('txNo')}
              >
                TX No
                {sortField === 'txNo' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('name')}
              >
                <div className="th-content">
                  <div>Name</div>
                  {sortField === 'name' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                  <input
                    type="text"
                    className="column-filter"
                    placeholder="Фильтр..."
                    value={columnFilters.name}
                    onChange={(e) => setColumnFilters({ ...columnFilters, name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('customerNo')}
              >
                <div className="th-content">
                  <div>Customer No</div>
                  {sortField === 'customerNo' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                  <input
                    type="text"
                    className="column-filter"
                    placeholder="Фильтр..."
                    value={columnFilters.customerNo}
                    onChange={(e) => setColumnFilters({ ...columnFilters, customerNo: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('source')}
              >
                <div className="th-content">
                  <div>Source</div>
                  {sortField === 'source' && (
                    <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                  <select
                    className="column-filter-select"
                    value={columnFilters.source}
                    onChange={(e) => setColumnFilters({ ...columnFilters, source: e.target.value as SourceType | '' })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Все</option>
                    <option value="White List">White List</option>
                    <option value="Black List">Black List</option>
                  </select>
                </div>
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('transactionType')}
              >
                Transaction Type
                {sortField === 'transactionType' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('originSource')}
              >
                Origin Source
                {sortField === 'originSource' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th>List Group</th>
              <th 
                className="sortable"
                onClick={() => handleSort('createdDate')}
              >
                Created Date
                {sortField === 'createdDate' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('createdUser')}
              >
                Created User
                {sortField === 'createdUser' && (
                  <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedEntries.length === 0 ? (
              <tr>
                <td colSpan={11} className="empty-state">
                  {entries.length === 0 
                    ? 'Нет данных для отображения. Импортируйте клиентов через кнопку "Импорт".'
                    : 'Нет записей, соответствующих фильтрам.'}
                </td>
              </tr>
            ) : (
              filteredAndSortedEntries.map((entry) => {
                const entryKey = getEntryKey(entry)
                const originalIndex = entries.findIndex(e => getEntryKey(e) === entryKey)
                return (
                  <tr 
                    key={entryKey}
                    className={selectedEntries.has(entryKey) ? 'selected' : ''}
                  >
                    <td className="select-column">
                      <input
                        type="checkbox"
                        checked={selectedEntries.has(entryKey)}
                        onChange={() => handleToggleSelect(entry)}
                      />
                    </td>
                    <td>{entry.txNo}</td>
                    <td>{entry.name}</td>
                    <td>{entry.customerNo}</td>
                    <td>
                      <span className={`badge badge-${entry.source === 'White List' ? 'success' : 'danger'}`}>
                        {entry.source}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${entry.transactionType === 'Insert' ? 'primary' : 'warning'}`}>
                        {entry.transactionType}
                      </span>
                    </td>
                    <td>{entry.originSource}</td>
                    <td>{entry.listGroup || '-'}</td>
                    <td>{entry.createdDate}</td>
                    <td>{entry.createdUser}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleView(entry)}
                          title="Просмотр"
                        >
                          View
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(entry)}
                          title="Редактировать"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleRemoveEntry(originalIndex >= 0 ? originalIndex : 0)}
                          title="Удалить"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedCustomer(null)
          }}
          onEdit={(updatedCustomer) => {
            setEntries(
              entries.map((entry) => {
                if (
                  entry.customerNo === updatedCustomer.customerNumber ||
                  entry.customerNo === updatedCustomer.customerId
                ) {
                  return {
                    ...entry,
                    name: updatedCustomer.name,
                    searchName: updatedCustomer.searchName,
                  }
                }
                return entry
              })
            )
            setIsDetailModalOpen(false)
            setSelectedCustomer(null)
          }}
          onDelete={(uqId) => {
            const customer = mockCustomers.find((c) => c.uqId === uqId)
            if (customer) {
              setEntries(
                entries.filter(
                  (entry) =>
                    entry.customerNo !== customer.customerNumber &&
                    entry.customerNo !== customer.customerId
                )
              )
            }
            setIsDetailModalOpen(false)
            setSelectedCustomer(null)
          }}
          consistencyMatches={getConsistencyMatches(selectedCustomer.uqId)}
          history={getHistory(selectedCustomer.uqId)}
        />
      )}

      {/* Модальное окно импорта */}
      <ImportCustomersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportFromModal}
        currentTxNo={currentTxNo}
        defaultSource={source}
        defaultTransactionType={transactionType}
        defaultOriginSource={originSource || 'Import'}
        defaultListGroup={listGroup}
        currentUser={role === 'Maker' ? 'maker1' : 'user1'}
      />
    </div>
  )
}
