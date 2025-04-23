import React from 'react'
import { ENDPOINTS } from '../api/endpoints'
import Layout from '@/components/Layout';
import UsersHeader from '@/components/admin/users_header';
import UsersBody from '@/components/admin/users_body';
const UsersPage = () => {
    const userType = "admin";
  return (
    <Layout userType={userType}>

    <div className="flex-1 overflow-y-auto">
     <UsersHeader />
     <UsersBody />

    </div>

</Layout>
  )
}

export default UsersPage
