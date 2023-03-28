import React from 'react';
import Layout from '@/components/Layout';
import UserDashboard from '@/components/UserDashboard';
import withAuth from '@/components/withAuth';

const DashboardPage = () => {
  return (
    <Layout>
      <UserDashboard />
    </Layout>
  );
};

export default withAuth(DashboardPage);
