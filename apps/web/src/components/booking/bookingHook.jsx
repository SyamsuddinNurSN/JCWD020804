// TransactionHooks.js

import { useEffect, useState } from 'react';
import axios from 'axios';

export const useBookingDetails = (id) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const token = localStorage.getItem('token');
  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/booking/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBookingDetails(response.data.result);
      // console.log(response.data.result);
    } catch (error) {
      console.error('Error fetching Booking details:', error);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  return { bookingDetails, fetchBookingDetails };
};
