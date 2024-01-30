import { Navigate, Outlet } from 'react-router-dom';

function TenantOnly() {
  const isTenant = localStorage.getItem('isTenant')

  return isTenant ? <Outlet /> : <Navigate to='/' />
}

export default TenantOnly;
