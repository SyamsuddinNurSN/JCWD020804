// src/components/TransactionForm.js
import React, { useEffect, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate, useParams } from 'react-router-dom';
import  axios  from 'axios';
import { Navbarpage } from '../../components/navbar';

export const DetailPage = () => {
  const {id} = useParams()
  const[propertyDetails, setPropertyDetails] = useState()
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(null);

  const roomImage =
    'https://all.accor.com/middleware/images/1385747632498/1681988911601/so-text-with-image-600x500-low.jpg'; // Replace with the actual URL
  
  const handleBooking = () => {
    if (selectedRoom) {
      navigate('/booking', {
        state: {
          checkInDate,
          checkOutDate,
          selectedRoom,
          roomPrice: selectedRoom.price
        },
      });
    } else {
      // Handle the case where no room is selected
      console.error('Please select a room before booking.');
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const fetchApi = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/property/${id}`)
        console.log(response.data);
        setPropertyDetails(response?.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [id]);


  return (
    <>
    <Navbarpage/>
    <div className="container mx-auto my-8 flex items-center justify-between">
      {/* Room Information - Left Side */}
      <div className="w-1/2 pr-4">
        {/* Display Room Image */}
        <img src={roomImage} alt="Hotel Room" className="mb-4 w-full h-auto" />

        {/* Display Price Room Per Night
        <div className="mb-4">
          <p className="text-xl font-bold">{}</p>
        </div> */}

        {/* Display Property Description */}
        <div className="mb-4">
          <p>{propertyDetails?.description}</p>
        </div>

        {/* Display Room List */}
        {propertyDetails?.Rooms && propertyDetails?.Rooms.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Available Rooms:</h2>
            <ul>
              {propertyDetails.Rooms.map((room) => (
                <li
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className={`cursor-pointer ${
                    selectedRoom && selectedRoom.id === room.id ? 'text-blue-500 font-bold' : ''
                  }`}
                >
                  <p>{room.name}</p>
                  <p>Price: {room.price}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Date Range Calendar - Right Side */}
      <div className="w-1/2 pl-4 flex flex-col items-center justify-center">
        <div className="mb-4">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setDateRange([item.selection]);
              setCheckInDate(item.selection.startDate);
              setCheckOutDate(item.selection.endDate);
            }}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
        </div>

        {/* Booking Button */}
        <div>
          <Button
            color="lightBlue"
            buttonType="filled"
            size="regular"
            rounded={false}
            block={false}
            ripple="light"
            onClick={handleBooking}
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};
