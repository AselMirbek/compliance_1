import { Customer, Transaction, Application, SourceType } from '../types'

export const mockCustomers: Customer[] = [
  {
    uqId: 'WL-001',
    name: 'Иванов Иван Иванович',
    searchName: 'ИВАНОВ ИВАН ИВАНОВИЧ',
    customerName: 'Иванов И.И.',
    customerId: 'CUST-001',
    customerNumber: '1234567890',
    createdDate: '2024-01-15',
    createdUser: 'user1',
    originSource: 'Internal',
    type: 'Individual',
    source: 'White List',
    status: 'Active',
    passport: '45 12 345678',
    identificationData: 'ID-123456',
  },
  {
    uqId: 'BL-001',
    name: 'Петров Петр Петрович',
    searchName: 'ПЕТРОВ ПЕТР ПЕТРОВИЧ',
    customerName: 'Петров П.П.',
    customerId: 'CUST-002',
    customerNumber: '0987654321',
    createdDate: '2024-01-10',
    createdUser: 'user2',
    originSource: 'External',
    type: 'Individual',
    source: 'Black List',
    status: 'Active',
    passport: '78 90 123456',
    identificationData: 'ID-789012',
  },
  {
    uqId: 'CB-001',
    name: 'ООО "Компания"',
    searchName: 'ООО КОМПАНИЯ',
    customerName: 'ООО "Компания"',
    customerId: 'CUST-003',
    customerNumber: '5555555555',
    createdDate: '2024-01-20',
    createdUser: 'user1',
    originSource: 'Internal',
    type: 'Legal Entity',
    source: 'Customer Base',
    status: 'Active',
  },
]

export const mockTransactions: Transaction[] = [
  {
    transactionNo: 'TXN-001',
    customerNo: 'CUST-001',
    name: 'Иванов Иван Иванович',
    type: 'Insert',
    match: 100,
    createdDate: '2024-01-25',
    user: 'maker1',
    source: 'White List',
  },
  {
    transactionNo: 'TXN-002',
    customerNo: 'CUST-002',
    name: 'Петров Петр Петрович',
    type: 'Delete',
    createdDate: '2024-01-24',
    user: 'maker2',
    source: 'Black List',
  },
]

export const getConsistencyMatches = (customerId: string): any[] => {
  return [
    {
      uqId: 'WL-002',
      name: 'Иванов И.И.',
      matchPercentage: 85,
      source: 'White List' as SourceType,
    },
    {
      uqId: 'CB-002',
      name: 'Иванов Иван',
      matchPercentage: 70,
      source: 'Customer Base' as SourceType,
    },
  ]
}

export const getHistory = (customerId: string): any[] => {
  return [
    {
      date: '2024-01-15 10:30:00',
      user: 'user1',
      action: 'Created',
      changes: 'Запись создана',
    },
    {
      date: '2024-01-16 14:20:00',
      user: 'user2',
      action: 'Updated',
      changes: 'Обновлены персональные данные',
    },
  ]
}

export const mockApplications: Application[] = [
  {
    id: 'APP-001',
    transactionNo: 'TXN-003',
    customerNo: 'CUST-004',
    name: 'Сидоров Сидор Сидорович',
    type: 'Insert',
    status: 'pending',
    match: 100,
    createdDate: '2024-01-26',
    user: 'maker1',
    source: 'White List',
  },
  {
    id: 'APP-002',
    transactionNo: 'TXN-004',
    customerNo: 'CUST-005',
    name: 'Козлов Козел Козлович',
    type: 'Delete',
    status: 'pending',
    match: 85,
    createdDate: '2024-01-25',
    user: 'maker2',
    source: 'Black List',
  },
  {
    id: 'APP-003',
    transactionNo: 'TXN-005',
    customerNo: 'CUST-006',
    name: 'ООО "Новая Компания"',
    type: 'Insert',
    status: 'approved',
    match: 90,
    createdDate: '2024-01-24',
    user: 'maker1',
    source: 'Customer Base',
  },
  {
    id: 'APP-004',
    transactionNo: 'TXN-006',
    customerNo: 'CUST-007',
    name: 'Волков Волк Волкович',
    type: 'Insert',
    status: 'pending',
    createdDate: '2024-01-27',
    user: 'maker3',
    source: 'White List',
  },
]

