import { Navigate, Outlet } from 'react-router-dom';

function UserOnly() {
  const isTenant = localStorage.getItem('isTenant')
  return isTenant === 'false' ? <Outlet /> : <Navigate to='/' /> 
}

export default UserOnly;
