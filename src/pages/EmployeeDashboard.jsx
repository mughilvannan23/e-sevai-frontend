import React, { useState, useEffect } from 'react';
import { workAPI } from '../services/api';
import Loading from '../components/common/Loading';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await workAPI.getMyWorkStats();
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{ ...styles.statCard, borderColor: color }}>
      <div style={{ ...styles.statIcon, backgroundColor: color }}>
        {icon}
      </div>
      <div style={styles.statContent}>
        <h3 style={styles.statValue}>{value}</h3>
        <p style={styles.statTitle}>{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p style={styles.subtitle}>Here's your work overview</p>
      </div>

      {stats && (
        <div style={styles.statsGrid}>
          <StatCard
            title="Today's Tasks"
            value={stats.todayWorks}
            icon="📋"
            color="#3498db"
          />
          <StatCard
            title="Today's Earnings"
            value={`₹${stats.todayEarnings.toLocaleString()}`}
            icon="💰"
            color="#27ae60"
          />
          <StatCard
            title="Total Works"
            value={stats.totalWorks}
            icon="📊"
            color="#f39c12"
          />
          <StatCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            icon="🏆"
            color="#9b59b6"
          />
        </div>
      )}

      <div style={styles.detailsSection}>
        <h2 style={styles.sectionTitle}>This Month Overview</h2>
        <div style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>Works Completed</h3>
            <div style={styles.detailValue}>
              {stats?.monthWorks || 0}
            </div>
            <div style={styles.detailSubtext}>
              {stats?.pendingWorks || 0} pending
            </div>
          </div>
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}>Earnings</h3>
            <div style={styles.detailValue}>
              ₹{stats?.monthEarnings.toLocaleString() || '0'}
            </div>
            <div style={styles.detailSubtext}>
              Pending: ₹{stats?.pendingPayments?.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <a href="/employee/works" style={styles.actionBtn}>
            <span style={styles.actionIcon}>➕</span>
            <span>Add New Work</span>
          </a>
          <a href="/employee/works" style={styles.actionBtn}>
            <span style={styles.actionIcon}>📋</span>
            <span>View My Works</span>
          </a>
          <a href="/employee/reports" style={styles.actionBtn}>
            <span style={styles.actionIcon}>📊</span>
            <span>View Reports</span>
          </a>
        </div>
      </div>
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginRight: '20px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    margin: '0 0 4px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  statTitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  detailsSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  detailCard: {
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  detailTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  detailValue: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#27ae60'
  },
  detailSubtext: {
    margin: 0,
    fontSize: '14px',
    color: '#666'
  },
  quickActions: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#2c3e50',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    border: '1px solid #e9ecef'
  },
  actionIcon: {
    fontSize: '20px'
  }
};

export default EmployeeDashboard;