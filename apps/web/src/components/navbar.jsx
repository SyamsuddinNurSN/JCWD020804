import { Navbar, Typography, IconButton, Button, Input } from '@material-tailwind/react';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ProfileMenu } from './profileMenu';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'; 


export function Navbarpage() {
  const user = useSelector((state) => state.user.value);
  const id = user.id;
  const profilPicture = user.picture;

  
  const [userStatus, setUserStatus] = useState('User');

  const checkUser = () => {
    if (user.isTenant) {
      setUserStatus('Tenant');
    } else {
      setUserStatus('User');
    }
  };

  useEffect(() => {
    checkUser();
  }, [user.isTenant]); 

  return (
    <Navbar variant="gradient" color="white" className="max-w-full">
      <div className="flex items-center justify-between gap-4 text-white w-full">
        
        <div className="flex items-center gap-4">
          <img
            src="../src/assets/masnstay.jpg"
            alt="Logo"
            className="h-16 w-16 mr-2 "
          />
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="cursor-pointer py-1.5 text-black"
          >
            MasnStay
          </Typography>
        </div>

        <div className="relative flex items-center">
            <Input
              type="search"
              color="yellow"
              label="Type here..."
              className="pr-10"
              containerProps={{
                className: 'min-w-[750px]',
              }}
            />
            <Button
              size="sm"
              color="yellow"
              className="absolute right-0 top-0 mt-1 rounded"
            >
              Search
            </Button>
          </div>

        <div className="flex gap-4 items-center">
          <IconButton
            variant="text"
            color="yellow"
            className="bg-yellow-500 text-black"
          >
            <Cog6ToothIcon className="h-4 w-4" />
          </IconButton>
          <IconButton
            variant="text"
            color="yellow"
            className="bg-yellow-500 text-black"
          >
            <BellIcon className="h-4 w-4" />
          </IconButton>
        

          {!id ? (
            <>
              <Link to={'/login'}>
                <Button className="bg-yellow-500 text-black">Log In</Button>
              </Link>
              <Link to={'/register'}>
                <Button className="bg-yellow-500 text-black">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <ProfileMenu
                variant="circular"
                size="sm"
                alt="Profile"
                className="border border-gray-900 p-0.5"
                src={`http://localhost:8000/api/${profilPicture}`}
              />
              <Typography
                as="a"
                href="#"
                variant="h6"
                className="cursor-pointer py-1.5 text-black"
              >
                {user.username}
                <span className={`text-xs ml-1 ${user.isTenant ? 'text-yellow-700' :''}`}>
                  {userStatus}
                </span>
              </Typography>
            </>
          )}
        </div>
      </div>
    </Navbar>
  );
}
