import { useState } from 'react'
import { CustomerCheckEntry, Customer, SourceType, TransactionType } from '../types'
import { mockCustomers } from '../data/mockData'
import './ImportCustomersModal.css'

interface ImportedRow {
  name: string
  customerNo?: string
  customerId?: string
  otherFields?: Record<string, string>
}

interface MatchResult {
  importedRow: ImportedRow
  matchedCustomer?: Customer
  matchType: 'exact' | 'partial' | 'none'
  matchScore?: number
}

interface ImportCustomersModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (entries: CustomerCheckEntry[]) => void
  currentTxNo: string
  defaultSource: SourceType
  defaultTransactionType: TransactionType
  defaultOriginSource: string | ''
  defaultListGroup?: string
  currentUser: string
}

export default function ImportCustomersModal({
  isOpen,
  onClose,
  onImport,
  currentTxNo,
  defaultSource,
  defaultTransactionType,
  defaultOriginSource,
  defaultListGroup,
  currentUser,
}: ImportCustomersModalProps) {
  const [mode, setMode] = useState<'import' | 'manual'>('import')
  const [importedData, setImportedData] = useState<MatchResult[]>([])
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  // Manual input fields
  const [manualName, setManualName] = useState('')
  const [manualCustomerNo, setManualCustomerNo] = useState('')
  const [manualSource, setManualSource] = useState<SourceType>(defaultSource)
  const [manualTransactionType, setManualTransactionType] = useState<TransactionType>(defaultTransactionType)
  const [manualOriginSource, setManualOriginSource] = useState<string>(defaultOriginSource)
  const [manualListGroup, setManualListGroup] = useState<string>(defaultListGroup || '')

  if (!isOpen) return null

  // Parse CSV file
  const parseCSV = (text: string): ImportedRow[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    // Try to detect header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const nameIndex = header.findIndex(h => h.includes('name') || h.includes('имя'))
    const customerNoIndex = header.findIndex(h => 
      h.includes('customer') || h.includes('number') || h.includes('id') || 
      h.includes('клиент') || h.includes('номер')
    )

    const rows: ImportedRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      if (values.length === 0 || !values[0]) continue

      const row: ImportedRow = {
        name: nameIndex >= 0 ? values[nameIndex] : values[0],
        otherFields: {},
      }

      if (customerNoIndex >= 0 && values[customerNoIndex]) {
        row.customerNo = values[customerNoIndex]
      }

      // Store other fields
      header.forEach((h, idx) => {
        if (idx !== nameIndex && idx !== customerNoIndex && values[idx]) {
          row.otherFields![h] = values[idx]
        }
      })

      rows.push(row)
    }

    return rows
  }

  // Find matches in database
  const findMatches = (rows: ImportedRow[]): MatchResult[] => {
    return rows.map(row => {
      const nameUpper = row.name.toUpperCase()
      let bestMatch: Customer | undefined
      let bestScore = 0
      let matchType: 'exact' | 'partial' | 'none' = 'none'

      // Try exact match by customer number
      if (row.customerNo || row.customerId) {
        const exactMatch = mockCustomers.find(c => 
          c.customerNumber === row.customerNo || 
          c.customerId === row.customerNo ||
          c.customerNumber === row.customerId ||
          c.customerId === row.customerId
        )
        if (exactMatch) {
          return {
            importedRow: row,
            matchedCustomer: exactMatch,
            matchType: 'exact',
            matchScore: 100,
          }
        }
      }

      // Try exact name match
      const exactNameMatch = mockCustomers.find(c => 
        c.name.toUpperCase() === nameUpper ||
        c.searchName === nameUpper
      )
      if (exactNameMatch) {
        return {
          importedRow: row,
          matchedCustomer: exactNameMatch,
          matchType: 'exact',
          matchScore: 100,
        }
      }

      // Try partial match
      for (const customer of mockCustomers) {
        const customerNameUpper = customer.name.toUpperCase()
        const searchNameUpper = customer.searchName.toUpperCase()
        
        // Calculate similarity
        let score = 0
        if (customerNameUpper.includes(nameUpper) || nameUpper.includes(customerNameUpper)) {
          score = Math.min(nameUpper.length, customerNameUpper.length) / Math.max(nameUpper.length, customerNameUpper.length) * 100
        } else if (searchNameUpper.includes(nameUpper) || nameUpper.includes(searchNameUpper)) {
          score = Math.min(nameUpper.length, searchNameUpper.length) / Math.max(nameUpper.length, searchNameUpper.length) * 100
        }

        if (score > bestScore && score >= 50) {
          bestScore = score
          bestMatch = customer
          matchType = 'partial'
        }
      }

      return {
        importedRow: row,
        matchedCustomer: bestMatch,
        matchType: matchType,
        matchScore: bestScore > 0 ? Math.round(bestScore) : undefined,
      }
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const text = await file.text()
      const rows = parseCSV(text)
      
      if (rows.length === 0) {
        alert('Файл пуст или неверный формат')
        setIsProcessing(false)
        return
      }

      const matches = findMatches(rows)
      setImportedData(matches)
      // Select all by default
      setSelectedRows(new Set(matches.map((_, i) => i)))
    } catch (error) {
      alert('Ошибка при чтении файла: ' + (error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleSelect = (index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedRows.size === importedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(importedData.map((_, i) => i)))
    }
  }

  const handleAddSelected = () => {
    if (selectedRows.size === 0) {
      alert('Выберите записи для добавления')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const entries: CustomerCheckEntry[] = []

    Array.from(selectedRows).forEach(index => {
      const match = importedData[index]
      const row = match.importedRow

      // Use matched customer if exists, otherwise create new entry
      if (match.matchedCustomer) {
        entries.push({
          txNo: currentTxNo,
          name: match.matchedCustomer.name,
          customerNo: match.matchedCustomer.customerNumber || match.matchedCustomer.customerId || 'N/A',
          searchName: match.matchedCustomer.searchName,
          createdDate: today,
          createdUser: currentUser,
          source: defaultSource,
          transactionType: defaultTransactionType,
          originSource: defaultOriginSource || 'Import',
          listGroup: defaultSource === 'Black List' ? (defaultListGroup || undefined) : undefined,
        })
      } else {
        // Create entry from imported row
        entries.push({
          txNo: currentTxNo,
          name: row.name,
          customerNo: row.customerNo || row.customerId || 'N/A',
          searchName: row.name.toUpperCase(),
          createdDate: today,
          createdUser: currentUser,
          source: defaultSource,
          transactionType: defaultTransactionType,
          originSource: defaultOriginSource || 'Import',
          listGroup: defaultSource === 'Black List' ? (defaultListGroup || undefined) : undefined,
        })
      }
    })

    onImport(entries)
    onClose()
    // Reset state
    setImportedData([])
    setSelectedRows(new Set())
    setManualName('')
    setManualCustomerNo('')
  }

  const handleManualAdd = () => {
    if (!manualName.trim()) {
      alert('Введите имя клиента')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const entry: CustomerCheckEntry = {
      txNo: currentTxNo,
      name: manualName.trim(),
      customerNo: manualCustomerNo.trim() || 'N/A',
      searchName: manualName.trim().toUpperCase(),
      createdDate: today,
      createdUser: currentUser,
      source: manualSource,
      transactionType: manualTransactionType,
      originSource: manualOriginSource || 'Manual',
      listGroup: manualSource === 'Black List' ? (manualListGroup || undefined) : undefined,
    }

    onImport([entry])
    onClose()
    setManualName('')
    setManualCustomerNo('')
  }

  return (
    <div className="import-modal-overlay" onClick={onClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="import-modal-header">
          <h3>Импорт клиентов</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="import-modal-body">
          <div className="mode-selector">
            <button
              className={`mode-btn ${mode === 'import' ? 'active' : ''}`}
              onClick={() => setMode('import')}
            >
              Импорт из файла
            </button>
            <button
              className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              Ручной ввод
            </button>
          </div>

          {mode === 'import' ? (
            <div className="import-section">
              {importedData.length === 0 ? (
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload-import"
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.xls"
                    style={{ display: 'none' }}
                    disabled={isProcessing}
                  />
                  <label htmlFor="file-upload-import" className="file-upload-label">
                    {isProcessing ? 'Обработка...' : 'Выберите файл (CSV, Excel)'}
                  </label>
                  <p className="file-upload-hint">
                    Поддерживаемые форматы: CSV, Excel. Файл должен содержать колонки с именем и номером клиента.
                  </p>
                </div>
              ) : (
                <div className="import-results">
                  <div className="results-header">
                    <div>
                      <strong>Найдено записей: {importedData.length}</strong>
                      <span className="results-stats">
                        Совпадений: {importedData.filter(m => m.matchedCustomer).length} | 
                        Новых: {importedData.filter(m => !m.matchedCustomer).length}
                      </span>
                    </div>
                    <button
                      className="btn btn-link"
                      onClick={handleSelectAll}
                    >
                      {selectedRows.size === importedData.length ? 'Снять выбор' : 'Выбрать все'}
                    </button>
                  </div>

                  <div className="results-table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>
                            <input
                              type="checkbox"
                              checked={selectedRows.size === importedData.length && importedData.length > 0}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Имя</th>
                          <th>Номер клиента</th>
                          <th>Совпадение</th>
                          <th>Действие</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importedData.map((match, index) => (
                          <tr key={index} className={match.matchType === 'exact' ? 'match-exact' : match.matchType === 'partial' ? 'match-partial' : ''}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRows.has(index)}
                                onChange={() => handleToggleSelect(index)}
                              />
                            </td>
                            <td>{match.importedRow.name}</td>
                            <td>{match.importedRow.customerNo || match.importedRow.customerId || '-'}</td>
                            <td>
                              {match.matchedCustomer ? (
                                <div className="match-info">
                                  <span className={`match-badge match-${match.matchType}`}>
                                    {match.matchType === 'exact' ? 'Точное' : `Частичное ${match.matchScore}%`}
                                  </span>
                                  <div className="match-details">
                                    {match.matchedCustomer.name} ({match.matchedCustomer.source})
                                  </div>
                                </div>
                              ) : (
                                <span className="match-badge match-none">Новое</span>
                              )}
                            </td>
                            <td>
                              {match.matchedCustomer ? (
                                <span className="action-badge">
                                  {defaultTransactionType === 'Insert' ? 'Добавить' : 'Удалить'}
                                </span>
                              ) : (
                                <span className="action-badge action-insert">Добавить</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="import-actions">
                    <button className="btn btn-secondary" onClick={() => {
                      setImportedData([])
                      setSelectedRows(new Set())
                    }}>
                      Очистить
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddSelected}
                      disabled={selectedRows.size === 0}
                    >
                      Добавить выбранные ({selectedRows.size})
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="manual-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Имя клиента *</label>
                  <input
                    type="text"
                    className="input"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Введите полное имя клиента"
                  />
                </div>

                <div className="form-group">
                  <label>Номер клиента</label>
                  <input
                    type="text"
                    className="input"
                    value={manualCustomerNo}
                    onChange={(e) => setManualCustomerNo(e.target.value)}
                    placeholder="Опционально"
                  />
                </div>

                <div className="form-group">
                  <label>Source *</label>
                  <select
                    className="select"
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value as SourceType)}
                  >
                    <option value="White List">White List</option>
                    <option value="Black List">Black List</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction Type *</label>
                  <select
                    className="select"
                    value={manualTransactionType}
                    onChange={(e) => setManualTransactionType(e.target.value as TransactionType)}
                  >
                    <option value="Insert">Insert</option>
                    <option value="Delete">Delete</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Origin Source</label>
                  <input
                    type="text"
                    className="input"
                    value={manualOriginSource}
                    onChange={(e) => setManualOriginSource(e.target.value)}
                    placeholder="Откуда добавлен"
                  />
                </div>

                {manualSource === 'Black List' && (
                  <div className="form-group">
                    <label>List Group</label>
                    <input
                      type="text"
                      className="input"
                      value={manualListGroup}
                      onChange={(e) => setManualListGroup(e.target.value)}
                      placeholder="Опционально"
                    />
                  </div>
                )}
              </div>

              <div className="manual-actions">
                <button className="btn btn-secondary" onClick={onClose}>
                  Отмена
                </button>
                <button className="btn btn-primary" onClick={handleManualAdd}>
                  Добавить клиента
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

