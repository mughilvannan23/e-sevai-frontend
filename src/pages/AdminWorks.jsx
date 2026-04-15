import React, { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../services/api';
import Loading from '../components/common/Loading.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { useToast } from '../components/common/Toast.jsx';

const AdminWorks = () => {
  const [activeTab, setActiveTab] = useState('entries');
  const [works, setWorks] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: '',
    employeeId: '',
    paymentStatus: '',
    workStatus: ''
  });
  const [employees, setEmployees] = useState([]);
  const { success, error } = useToast();

  useEffect(() => {
    if (activeTab === 'entries') {
      fetchWorks();
      fetchEmployees();
    } else {
      fetchWorkItems();
    }
  }, [activeTab, filters.page, filters.limit, filters.paymentStatus, filters.workStatus, filters.search, filters.startDate, filters.endDate, filters.employeeId]);

  const fetchWorkItems = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWorkItems();
      if (response.data.success) {
        setWorkItems(response.data.workItems);
      }
    } catch (err) {
      console.error('Error fetching work items:', err);
      error('Failed to fetch work items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkItem = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.createWorkItem(newItem);
      if (response.data.success) {
        success('Work Item created successfully');
        setNewItem({ name: '', price: '' });
        fetchWorkItems();
      }
    } catch (err) {
      error('Failed to create Work Item');
    }
  };

  const handleDeleteWorkItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this work item preset?')) {
      try {
        await adminAPI.deleteWorkItem(id);
        success('Work Item deleted');
        fetchWorkItems();
      } catch (err) {
        error('Failed to delete work item');
      }
    }
  };

  const fetchWorks = async () => {
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

      const response = await adminAPI.getAllWorks(params);
      if (response.data.success) {
        setWorks(response.data.works);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching works:', err);
      error('Failed to fetch works');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await userAPI.getEmployees({ page: 1, limit: 100 });
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorks();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status, type) => {
    const isPayment = type === 'payment';
    const paid = status === 'Paid';
    const completed = status === 'Completed';
    
    return (
      <span style={{
        ...styles.badge,
        backgroundColor: isPayment 
          ? (paid ? '#27ae60' : '#e74c3c')
          : (completed ? '#27ae60' : '#f39c12'),
        color: 'white'
      }}>
        {status}
      </span>
    );
  };

  if (loading && works.length === 0) {
    return <Loading text="Loading works..." />;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Work</h1>
        <p style={styles.subtitle}>Manage employee entries and Admin Work Item presets</p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'entries' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('entries')}
        >
          Employee Work Entries
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'items' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('items')}
        >
          Admin Work Pricing Presets
        </button>
      </div>

      {activeTab === 'entries' && (
        <>
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
                placeholder="Customer name or work title"
                style={styles.input}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>From Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                style={styles.input}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>To Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.filtersRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Employee</label>
              <select
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                style={styles.select}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Payment Status</label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                style={styles.select}
              >
                <option value="">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Work Status</label>
              <select
                name="workStatus"
                value={filters.workStatus}
                onChange={handleFilterChange}
                style={styles.select}
              >
                <option value="">All</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>
          <div style={styles.filtersActions}>
            <button type="submit" style={styles.searchBtn}>
              Apply Filters
            </button>
            <button 
              type="button" 
              style={styles.resetBtn}
              onClick={() => setFilters({
                page: 1,
                limit: 10,
                search: '',
                startDate: '',
                endDate: '',
                employeeId: '',
                paymentStatus: '',
                workStatus: ''
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
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Work Title</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Work Status</th>
              </tr>
            </thead>
            <tbody>
              {works.map(work => (
                <tr key={work._id}>
                  <td style={styles.td}>
                    <div style={styles.employeeInfo}>
                      <div style={styles.employeeName}>{work.employee?.name}</div>
                      <div style={styles.employeeId}>{work.employee?.employeeId}</div>
                    </div>
                  </td>
                  <td style={styles.td}>{formatDate(work.date)}</td>
                  <td style={styles.td}>{work.customerName}</td>
                  <td style={styles.td}>{work.workTitle}</td>
                  <td style={styles.td}>₹{work.amount.toLocaleString()}</td>
                  <td style={styles.td}>
                    {getStatusBadge(work.paymentStatus, 'payment')}
                  </td>
                  <td style={styles.td}>
                    {getStatusBadge(work.workStatus, 'work')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {works.length === 0 && (
          <div style={styles.noData}>No works found</div>
        )}

        {pagination.totalWorks > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalWorks}
            itemsPerPage={pagination.limit}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          />
        )}
      </div>
      </>
      )}

      {activeTab === 'items' && (
        <div style={styles.tableCard}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Add New Work Item Preset</h3>
            <form onSubmit={handleCreateWorkItem} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Work Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={styles.input}
                  placeholder="E.g. Logo Design"
                />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Fixed Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  style={styles.input}
                  placeholder="0.00"
                />
              </div>
              <button type="submit" style={styles.addBtn}>Add Preset</button>
            </form>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Work Name</th>
                  <th style={styles.th}>Admin Fixed Price</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workItems.map(item => (
                  <tr key={item._id}>
                    <td style={styles.td}><strong>{item.name}</strong></td>
                    <td style={styles.td}>₹{item.price.toLocaleString()}</td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => handleDeleteWorkItem(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {workItems.length === 0 && !loading && (
              <div style={styles.noData}>No Work Item Presets found. Add one above.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
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
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #e9ecef',
    fontSize: '14px'
  },
  employeeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  employeeName: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  employeeId: {
    fontSize: '12px',
    color: '#666'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  noData: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
    fontSize: '16px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px'
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    backgroundColor: '#3498db',
    color: 'white',
    borderColor: '#3498db'
  },
  addBtn: {
    padding: '10px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    height: '40px'
  },
  deleteBtn: {
    padding: '6px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  }
};

export default AdminWorks;