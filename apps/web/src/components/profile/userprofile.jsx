import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditProfile } from './editprofile';
import loginImage from '../../assets/masnstay.jpg';
import PropTypes from 'prop-types';
import { Typography } from '@material-tailwind/react';

export const UserProfile = () => {
  const user = useSelector((state) => state.user.value);
  console.log(user);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(!modalOpen);

  return (
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 mx-auto">
      <Link to="/">
        <img
          className="object-cover h-20"
          src={loginImage}
          alt="Logo masnstay"
        />
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="cursor-pointer py-1.5 text-black"
        >
          MasnStay
        </Typography>
      </Link>

      <img src={`http://localhost:8000/${user.picture}`} />

      <div className="p-6 text-center">
        <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {user.name}
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {user.username}
        </p>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {user.email}
        </p>

        <p
          className="block mt-4 text-center text-black hover:text-yellow-800"
          onClick={handleModalOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </p>
      </div>
      <div>
        <p className="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
          Back to Home?
          <Link
            to="/"
            className="block ml-1 font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900"
          >
            Home
          </Link>
        </p>
      </div>

      {modalOpen && (
        <EditProfile modalOpen={modalOpen} handleModalOpen={handleModalOpen} />
      )}
    </div>
  );
};

UserProfile.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
};
