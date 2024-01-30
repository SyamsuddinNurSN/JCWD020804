import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

export function ProfileMenu() {
  const user = useSelector((state) => state.user.value);
 
  const profilePicture = user.picture;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isTenant');

    navigate('/');
    window.location.reload();
  };

  return (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt="profil"
          className="cursor-pointer"
          src={`http://localhost:8000/${profilePicture}`}
        />
      </MenuHandler>
      <MenuList>
        <MenuItem className="flex items-center gap-2">
          <Link to="/user-profile">
            <Typography variant="small" className="font-medium">
              My Profile
            </Typography>
          </Link>
        </MenuItem>

        {user.isTenant && (
          <MenuItem className="flex items-center gap-2">
            <Typography variant="small" className="font-medium">
              <Link to={'/list-your-property'}>List Your Property</Link>
            </Typography>
          </MenuItem>
        )}

        {!user.isTenant && (
          <MenuItem className="flex items-center gap-2">
            <Link to="/tenant">
              <span>Become A Tenant</span>
            </Link>
          </MenuItem>
        )}
        {!user.isTenant && (
          <MenuItem className="flex items-center gap-2">
            <Link to='/user/dashboard'>
            <Typography variant="small" className="font-medium">
              List Your Order
            </Typography>
            </Link>
          </MenuItem>
        )}
        <MenuItem className="flex items-center gap-2">
          <Typography variant="small" className="font-medium">
            Help
          </Typography>
        </MenuItem>
        <hr className="my-2 border-blue-gray-50" />
        <MenuItem className="flex items-center gap-2" onClick={handleLogout}>
          <Typography variant="small" className="font-medium">
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
