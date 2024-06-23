import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

export const FinancialRecordsContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const FinancialRecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${BASE_URL}/financial-records/getAllByUserID/${user.id}`)
        .then((response) => {
            console.log("Here we have found in useEffect",response);
            setRecords(response.data.data)
        })
        //await fetch(`http://localhost:4000/financial-records/getAllByUserID/${user.id}`);
        //if (!response.ok) throw new Error('Failed to fetch records');

        //const data = await response.json();
        //setRecords(data);
        console.log("we r checking", records);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [user]);

  const addRecord = async (record) => {
    try {
        const userData = {
            userId: record.userId,
            description: record.description,
            amount: record.amount,
            category: record.category,
            paymentMethod: record.paymentMethod,
        }
      const response = await axios.post(`${BASE_URL}/financial-records`,userData)
      .then((response) => {
        console.log("Thsi is rle", response);
        setRecords((prev) => [...prev, response.data.data]);
      });
      console.log("Raja bhai",records);
      /*fetch('http://localhost:4000/financial-records', {
        method: 'POST',
        body: JSON.stringify(record),
        headers: {
          'Content-Type': 'application/json',
        },
      });
       
      if (!response.ok) throw new Error('Failed to add record');

      const newRecord = await response.json();
      setRecords((prev) => [...prev, newRecord]);
      */
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const updateRecord = async (id, newRecord) => {
    try {
      const response = await fetch(`${BASE_URL}/financial-records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newRecord),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to update record');

      const updatedRecord = await response.json();
      setRecords((prev) => prev.map((record) => (record._id === id ? updatedRecord : record)));
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const deleteRecord = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/financial-records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete record');

      setRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);

  if (!context) {
    throw new Error('useFinancialRecords must be used within a FinancialRecordsProvider');
  }

  return context;
};
