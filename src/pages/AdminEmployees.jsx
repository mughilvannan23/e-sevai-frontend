import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import { useToast } from '../components/common/Toast';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isActive: true
  });
  const { success, error } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [filters.page, filters.limit, filters.status]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && key !== 'page' && key !== 'limit') {
          params[key] = filters[key];
        }
      });
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await userAPI.getEmployees(params);
      if (response.data.success) {
        setEmployees(response.data.employees);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        password: '',
        isActive: employee.isActive
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const response = await userAPI.updateEmployee(editingEmployee._id, formData);
        if (response.data.success) {
          success('Employee updated successfully');
          fetchEmployees();
          handleCloseModal();
        }
      } else {
        const response = await userAPI.createEmployee(formData);
        if (response.data.success) {
          success('Employee created successfully');
          fetchEmployees();
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Error saving employee:', err);
      error(err.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        const response = await userAPI.deleteEmployee(id);
        if (response.data.success) {
          success('Employee deactivated successfully');
          fetchEmployees();
        }
      } catch (err) {
        console.error('Error deleting employee:', err);
        error('Failed to delete employee');
      }
    }
  };

  if (loading && employees.length === 0) {
    return <Loading text="Loading employees..." />;
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Employees</h1>
          <p style={styles.subtitle}>Manage employee accounts</p>
        </div>
        <button 
          style={styles.addBtn}
          onClick={() => handleOpenModal()}
        >
          + Add Employee
        </button>
      </div>

      <div style={styles.filtersCard}>
        <form onSubmit={handleSearch} style={styles.filtersForm}>
          <div style={styles.filtersRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Name, email, or ID"
                style={styles.input}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={styles.select}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style={styles.filtersActions}>
            <button type="submit" style={styles.searchBtn}>
              Search
            </button>
            <button 
              type="button" 
              style={styles.resetBtn}
              onClick={() => setFilters({
                page: 1,
                limit: 10,
                search: '',
                status: ''
              })}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Last Login</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td style={styles.td}>{emp.employeeId}</td>
                  <td style={styles.td}>{emp.name}</td>
                  <td style={styles.td}>{emp.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: emp.isActive ? '#27ae60' : '#e74c3c',
                      color: 'white'
                    }}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {emp.lastLogin 
                      ? new Date(emp.lastLogin).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'
                    }
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleOpenModal(emp)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {employees.length === 0 && (
          <div style={styles.noData}>No employees found</div>
        )}

        {pagination.totalEmployees > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalEmployees}
            itemsPerPage={pagination.limit}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          />
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button style={styles.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter email"
                  required={!editingEmployee}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password {editingEmployee ? '(leave empty to keep current)' : ''}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder={editingEmployee ? "Enter new password" : "Enter password"}
                  required={!editingEmployee}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  Active
                </label>
              </div>
              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingEmployee ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  subtitle: {
    margin: 0,
    color: '#666',
    fontSize: '16px'
  },
  addBtn: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  filtersCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  filtersForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  filtersRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  filtersActions: {
    display: 'flex',
    gap: '12px'
  },
  searchBtn: {
    padding: '10px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  resetBtn: {
    padding: '10px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#2c3e50',
    borderBottom: '2px solid #e9ecef',
    fontSize: '14px'
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #e9ecef',
    fontSize: '14px'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '6px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '6px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  noData: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
    fontSize: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e9ecef'
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default AdminEmployees;