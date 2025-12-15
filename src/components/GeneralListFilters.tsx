import { SourceType, StatusType } from '../types'
import './GeneralListFilters.css'

interface GeneralListFiltersProps {
  searchName: string
  setSearchName: (value: string) => void
  source: SourceType | 'All'
  setSource: (value: SourceType | 'All') => void
  status: StatusType | 'All'
  setStatus: (value: StatusType | 'All') => void
  originSource: string
  setOriginSource: (value: string) => void
  dateFrom: string
  setDateFrom: (value: string) => void
  dateTo: string
  setDateTo: (value: string) => void
  onSearch: () => void
  onExport: () => void
}

export default function GeneralListFilters({
  searchName,
  setSearchName,
  source,
  setSource,
  status,
  setStatus,
  originSource,
  setOriginSource,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onSearch,
  onExport,
}: GeneralListFiltersProps) {
  return (
    <div className="filters">
      <div className="filters-row">
        <div className="filter-group">
          <label>Name</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Введите имя для поиска"
            className="input"
          />
        </div>
        <button className="btn btn-primary" onClick={onSearch}>
          Search
        </button>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label>Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as SourceType | 'All')}
            className="select"
          >
            <option value="All">All</option>
            <option value="White List">White List</option>
            <option value="Black List">Black List</option>
            <option value="Customer Base">Customer Base</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusType | 'All')}
            className="select"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Origin Source</label>
          <input
            type="text"
            value={originSource}
            onChange={(e) => setOriginSource(e.target.value)}
            placeholder="Origin Source"
            className="input"
          />
        </div>

        <div className="filter-group">
          <label>Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input"
          />
        </div>

        <div className="filter-group">
          <label>Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input"
          />
        </div>

        <button className="btn btn-secondary" onClick={onExport}>
          Export to Excel
        </button>
      </div>
    </div>
  )
}

