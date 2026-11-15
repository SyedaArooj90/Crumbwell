import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyEmployee = { name: '', role: '', phone: '' }
const emptySalary = { employee_id: '', amount: '', month: '' }

function AdminEmployees() {
  const { token } = useAuth()
  const [employees, setEmployees] = useState([])
  const [payments, setPayments] = useState([])
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee)
  const [salaryForm, setSalaryForm] = useState(emptySalary)
  const [employeeError, setEmployeeError] = useState('')
  const [salaryError, setSalaryError] = useState('')

  async function loadAll() {
    try {
      const [employeeList, paymentList] = await Promise.all([
        api('/employees', { token }),
        api('/salaries', { token }),
      ])
      setEmployees(employeeList)
      setPayments(paymentList)
    } catch (err) {
      setEmployeeError(err.message)
    }
  }

  useEffect(() => {
    loadAll()
  }, [token])

  function handleEmployeeChange(e) {
    setEmployeeForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSalaryChange(e) {
    setSalaryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAddEmployee(e) {
    e.preventDefault()
    setEmployeeError('')
    try {
      await api('/employees', { method: 'POST', token, body: employeeForm })
      setEmployeeForm(emptyEmployee)
      loadAll()
    } catch (err) {
      setEmployeeError(err.message)
    }
  }

  async function handleToggleActive(employee) {
    setEmployeeError('')
    try {
      await api(`/employees/${employee.employee_id}`, {
        method: 'PUT',
        token,
        body: { active: !employee.active },
      })
      loadAll()
    } catch (err) {
      setEmployeeError(err.message)
    }
  }

  async function handleDeleteEmployee(employee) {
    if (!window.confirm(`Remove "${employee.name}"?`)) return
    setEmployeeError('')
    try {
      await api(`/employees/${employee.employee_id}`, { method: 'DELETE', token })
      loadAll()
    } catch (err) {
      setEmployeeError(err.message)
    }
  }

  async function handlePaySalary(e) {
    e.preventDefault()
    setSalaryError('')
    try {
      await api('/salaries', { method: 'POST', token, body: salaryForm })
      setSalaryForm(emptySalary)
      loadAll()
    } catch (err) {
      setSalaryError(err.message)
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Employees
      </p>
      <h1>Employees</h1>

      <form className="order-form" onSubmit={handleAddEmployee}>
        <label>
          Name
          <input name="name" value={employeeForm.name} onChange={handleEmployeeChange} required />
        </label>
        <label>
          Role
          <input name="role" value={employeeForm.role} onChange={handleEmployeeChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={employeeForm.phone} onChange={handleEmployeeChange} />
        </label>
        {employeeError && <p className="form-error">{employeeError}</p>}
        <button type="submit" className="btn-primary">
          Add employee
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Joined</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.phone}</td>
              <td>{emp.join_date}</td>
              <td>{emp.active ? 'Active' : 'Inactive'}</td>
              <td>
                <button className="btn-primary" onClick={() => handleToggleActive(emp)}>
                  {emp.active ? 'Deactivate' : 'Activate'}
                </button>{' '}
                <button className="btn-danger" onClick={() => handleDeleteEmployee(emp)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pay salary</h2>
      <form className="order-form" onSubmit={handlePaySalary}>
        <label>
          Employee
          <select
            name="employee_id"
            value={salaryForm.employee_id}
            onChange={handleSalaryChange}
            required
          >
            <option value="">Choose an employee</option>
            {employees
              .filter((emp) => emp.active)
              .map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
          </select>
        </label>
        <label>
          Amount
          <input
            name="amount"
            type="number"
            min="1"
            value={salaryForm.amount}
            onChange={handleSalaryChange}
            required
          />
        </label>
        <label>
          Month
          <input
            name="month"
            type="month"
            value={salaryForm.month}
            onChange={handleSalaryChange}
            required
          />
        </label>
        {salaryError && <p className="form-error">{salaryError}</p>}
        <button type="submit" className="btn-primary">
          Pay salary
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Paid on</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.salary_id}>
              <td>{p.salary_id}</td>
              <td>{p.employee_name}</td>
              <td>{p.month}</td>
              <td>{p.amount}</td>
              <td>{p.paid_date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default AdminEmployees