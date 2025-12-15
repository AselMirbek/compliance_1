import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RoleProvider } from './contexts/RoleContext'
import Layout from './components/Layout'
import GeneralList from './pages/GeneralList'
import Applications from './pages/Applications'
import TransactionTable from './pages/TransactionTable'
import CustomerCheckPage from './pages/CustomerCheckPage'

function App() {
  return (
    <Router>
      <RoleProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<GeneralList />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/transactions" element={<TransactionTable />} />
            <Route path="/customer-check" element={<CustomerCheckPage />} />
          </Routes>
        </Layout>
      </RoleProvider>
    </Router>
  )
}

export default App

