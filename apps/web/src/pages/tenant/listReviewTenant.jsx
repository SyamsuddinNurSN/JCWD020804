// TenantReviews.js
import React, { useEffect, useState } from 'react';
import { Select, Card, CardBody, CardHeader, Rating } from '@material-tailwind/react';
import axios from 'axios';

export const TenantReviews = () => {
  const token = localStorage.getItem('token');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const getDataProperty = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/property/ratings',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data.result);
      setProperties(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedProperty(value);
  };
  useEffect(() => {
    getDataProperty();
  }, [selectedProperty]);

  return (
    <div className="container mx-auto p-4">
      <div className="w-72">
          <Select
            label="Your Property"
            // value={selectedProperty}
            onChange={handleSelectChange}
          >
            {properties.map((property) => (
              <Option key={property.id} value={property}>
                {property.name}
              </Option>
            ))}
          </Select>
        </div>
      <h2 className="text-2xl font-bold mb-4">Tenant Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedProperty.Reviews?.map((review) => (
          <Card key={review.id}>
            <CardBody>
              <Rating value={review.rating} readOnly />
              <p className="text-gray-700 mt-2">{review.user_review}</p>
              <p className="text-gray-500 mt-1">- {review.User.name}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
