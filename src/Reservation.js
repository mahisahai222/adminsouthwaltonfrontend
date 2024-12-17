import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://44.196.64.110:8132/api/reserve/reservations');
      console.log(response.data);
      if (response.data.success) {
        const reservationsData = Array.isArray(response.data.data) ? response.data.data : [];
        setReservations(reservationsData);
        console.log('Updated Reservations:', reservationsData);
      } else {
        console.error('Error fetching reservations: ', response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Handle delete reservation
  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`http://44.196.64.110:8132/api/reserve/reservation/${id}`); // Adjust the API URL
      setReservations(reservations.filter((reservation) => reservation._id !== id));
      window.alert('Reservation successfully deleted');
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  // Handle accept reservation
  const handleAcceptReservation = async (id) => {
    try {
      const response = await axios.put(`http://44.196.64.110:8132/api/reserve/reservation/${id}/accept`);
      alert(response.data.message); // Show success message
  
      // Update the state for the specific reservation
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === id ? { ...reservation, status: 'ACCEPTED' } : reservation
        )
      );
    } catch (error) {
      console.error('Error accepting reservation:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h1 style={{ fontSize: '24px', color: 'purple' }}>Reservation List</h1>
      </CCardHeader>
      <CCardBody>
        {reservations.length === 0 ? (
          <div>No reservations found.</div>
        ) : (
          <CTable hover bordered striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Pickup</CTableHeaderCell>
                <CTableHeaderCell scope="col">Drop</CTableHeaderCell>
                <CTableHeaderCell scope="col">Pick Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Drop Date</CTableHeaderCell>
                {/* <CTableHeaderCell scope="col">Accept</CTableHeaderCell> */}
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {reservations.map((reservation) => (
                <CTableRow key={reservation._id}>
                  <CTableDataCell>{reservation.pickup}</CTableDataCell>
                  <CTableDataCell>{reservation.drop}</CTableDataCell>
                  <CTableDataCell>{new Date(reservation.pickdate).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>{new Date(reservation.dropdate).toLocaleDateString()}</CTableDataCell>
                  {/* <CTableDataCell>
                    {reservation.status === 'ACCEPTED' ? (
                      <CButton color="secondary" disabled>
                        ACCEPTED
                      </CButton>
                    ) : (
                      <CButton color="success" onClick={() => handleAcceptReservation(reservation._id)}>
                        Accept
                      </CButton>
                    )}
                  </CTableDataCell> */}
                  <CTableDataCell>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: '#bb1616', cursor: 'pointer' }}
                      onClick={() => handleDeleteReservation(reservation._id)}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default Reservation;
