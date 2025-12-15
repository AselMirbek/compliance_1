export type SourceType = 'White List' | 'Black List' | 'Customer Base'
export type StatusType = 'Active' | 'Deleted'
export type TransactionType = 'Insert' | 'Delete'
export type UserRole = 'Maker' | 'Approval'

export interface Customer {
  uqId: string
  name: string
  searchName: string
  customerName: string
  customerId?: string
  customerNumber?: string
  createdDate: string
  createdUser: string
  originSource: string
  type: string
  source: SourceType
  status: StatusType
  passport?: string
  identificationData?: string
  otherData?: string
}

export interface ConsistencyMatch {
  uqId: string
  name: string
  matchPercentage: number
  source: SourceType
}

export interface HistoryEntry {
  date: string
  user: string
  action: string
  changes: string
}

export interface Transaction {
  transactionNo: string
  customerNo: string
  name: string
  type: TransactionType
  match?: number
  createdDate: string
  user: string
  source: SourceType
  customer?: Customer
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Application {
  id: string
  transactionNo: string
  customerNo: string
  name: string
  type: TransactionType
  status: ApplicationStatus
  match?: number
  createdDate: string
  user: string
  source: SourceType
  customer?: Customer
}

export interface CustomerCheckEntry {
  txNo: string
  name: string
  customerNo: string
  searchName: string
  createdDate: string
  createdUser: string
  source: SourceType
  transactionType: TransactionType
  originSource: string
  listGroup?: string
}

