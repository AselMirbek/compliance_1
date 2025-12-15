import { useState } from 'react'
import { SourceType, TransactionType, Customer } from '../types'
import './ImportDataModal.css'

interface ImportDataModalProps {
  onClose: () => void
  onImport: (customers: Customer[]) => void
}

export default function ImportDataModal({
  onClose,
  onImport,
}: ImportDataModalProps) {
  const [source, setSource] = useState<SourceType>('White List')
  const [transactionType, setTransactionType] = useState<TransactionType>('Insert')
  const [originSource, setOriginSource] = useState('')
  const [listGroup, setListGroup] = useState('')
  const [searchCustomerName, setSearchCustomerName] = useState('')
  const [mode, setMode] = useState<'import' | 'manual'>('import')

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Здесь будет логика импорта файла
      alert('Импорт файла будет реализован')
    }
  }

  const handleManualAdd = () => {
    if (!searchCustomerName) {
      alert('Введите имя клиента')
      return
    }

    const newCustomer: Customer = {
      uqId: `${source.substring(0, 2).toUpperCase()}-${Date.now()}`,
      name: searchCustomerName,
      searchName: searchCustomerName.toUpperCase(),
      customerName: searchCustomerName,
      createdDate: new Date().toISOString().split('T')[0],
      createdUser: 'current_user',
      originSource: originSource || 'Manual',
      type: 'Individual',
      source: source,
      status: transactionType === 'Insert' ? 'Active' : 'Deleted',
    }

    onImport([newCustomer])
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import Data</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="mode-selector">
            <button
              className={`mode-btn ${mode === 'import' ? 'active' : ''}`}
              onClick={() => setMode('import')}
            >
              Import File
            </button>
            <button
              className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              Manual Add
            </button>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Source *</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as SourceType)}
                className="select"
              >
                <option value="Black List">Black List</option>
                <option value="White List">White List</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Type *</label>
              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as TransactionType)
                }
                className="select"
              >
                <option value="Insert">Insert</option>
                <option value="Delete">Delete</option>
              </select>
            </div>

            <div className="form-group">
              <label>Origin Source</label>
              <input
                type="text"
                value={originSource}
                onChange={(e) => setOriginSource(e.target.value)}
                placeholder="Origin Source"
                className="input"
              />
            </div>

            {source === 'Black List' && (
              <div className="form-group">
                <label>List Group</label>
                <input
                  type="text"
                  value={listGroup}
                  onChange={(e) => setListGroup(e.target.value)}
                  placeholder="List Group"
                  className="input"
                />
              </div>
            )}
          </div>

          {mode === 'import' ? (
            <div className="import-section">
              <div className="file-upload">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileImport}
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  Выберите файл для импорта
                </label>
              </div>
            </div>
          ) : (
            <div className="manual-section">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={searchCustomerName}
                  onChange={(e) => setSearchCustomerName(e.target.value)}
                  placeholder="Введите имя клиента"
                  className="input"
                />
              </div>
              <button className="btn btn-primary" onClick={handleManualAdd}>
                Add Customer
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

