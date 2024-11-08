import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CFormInput, CRow, CCol } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const BookManageList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [viewOnlyVisible, setViewOnlyVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [assignDriverModalVisible, setAssignDriverModalVisible] = useState(false);
  const [currentDriver, setCurrentDriver] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:8132/api/book');
      setBookings(response?.data); // Ensure this is the correct data structure
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:8132/api/driver/'); // Update API endpoint if necessary
      setAvailableDrivers(response.data.data); // Adjust if your response structure is different
    } catch (error) {
      console.error("Error fetching drivers:", error.message);
    }
  };

  const viewBookingDetails = async (booking) => {
    setCurrentBooking(booking);
    await fetchAvailableDrivers(); // Fetch available drivers when viewing booking details
    setViewOnlyVisible(true);
  };


  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://44.196.192.232:8132/api/book/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const assignDriver = async () => {
    if (!currentDriver) return; 
  
    try {
      const requestData = {
        bookingId: currentBooking._id,
        driverId: currentDriver, 
      };
      const response = await axios.post(`http://44.196.192.232:8132/api/driver/assignDriver`, requestData);
      console.log("Response:", response.data);
      setAssignDriverModalVisible(false);
      setCurrentBooking(null);
      // Optionally refresh bookings after assignment
      fetchBookings(); 
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
    }
  };
  




  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Book Order List</h1>
          <CForm className="d-flex align-items-center">
          </CForm>
        </CCardHeader>
        <CCardBody>
          {bookings.length === 0 ? (
            <p>No bookings available</p>
          ) : (
            <CTable hover bordered striped responsive>
              <CTableHead color="dark">
                <CTableRow>
                <CTableHeaderCell>Pickup Location</CTableHeaderCell>
          <CTableHeaderCell>Drop Location</CTableHeaderCell>
          <CTableHeaderCell>Pick Date</CTableHeaderCell>
          <CTableHeaderCell>Drop Date</CTableHeaderCell>
          <CTableHeaderCell>Booking Name</CTableHeaderCell>
          <CTableHeaderCell>Phone</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Address</CTableHeaderCell>
          <CTableHeaderCell>Address H.</CTableHeaderCell> 
          <CTableHeaderCell>Actions</CTableHeaderCell>

                </CTableRow>
              </CTableHead>
              <CTableBody>
             {bookings
                .filter(booking =>
                  booking.bookingDetails.bname
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
                )
                .map((booking, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{booking.reservationDetails.pickup}</CTableDataCell>
                    <CTableDataCell>{booking.reservationDetails.drop}</CTableDataCell>
                    <CTableDataCell>{booking.reservationDetails.pickdate}</CTableDataCell>
                    <CTableDataCell>{booking.reservationDetails.dropdate}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.bname}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.bphone}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.bemail}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.baddress}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.baddressh}</CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteBooking(booking._id)}
                        style={{ cursor: 'pointer', marginRight: '10px', color: 'red' }}
                      />
                       <FontAwesomeIcon
                          icon={faEye}
                          onClick={() => viewBookingDetails(booking)}
                          style={{ cursor: 'pointer', color: 'green' }}
                        />
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>

     <CModal
        visible={viewOnlyVisible}
        onClose={() => setViewOnlyVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Booking Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Name:</strong> {currentBooking?.bookingDetails.bname}</p>
          <p><strong>Phone:</strong> {currentBooking?.bookingDetails.bphone}</p>
          <p><strong>Email:</strong> {currentBooking?.bookingDetails.bemail}</p>
          <p><strong>Address:</strong> {currentBooking?.bookingDetails.baddress}</p>
          <p><strong>Address H:</strong> {currentBooking?.bookingDetails.baddressh}</p>
          <p><strong>Pickup Location:</strong> {currentBooking?.reservationDetails.pickup}</p>
          <p><strong>Drop Location:</strong> {currentBooking?.reservationDetails.drop}</p>
          <p><strong>Pickup Date:</strong> {currentBooking?.reservationDetails.pickdate}</p>
          <p><strong>Drop Date:</strong> {currentBooking?.reservationDetails.dropdate}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewOnlyVisible(false)}>
            Close
          </CButton>
          <CButton size='sm' onClick={() => { setAssignDriverModalVisible(true); fetchAvailableDrivers(); }}>
            Assign Driver
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        visible={assignDriverModalVisible}
        onClose={() => setAssignDriverModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Assign Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <select onChange={e => setCurrentDriver(e.target.value)} value={currentDriver}>
                  <option value="">Select Driver</option>
                  {availableDrivers.map(driver => (
                    <option key={driver._id} value={driver._id}>{driver.name}</option>
                  ))}
                </select>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton  size='sm'  color="secondary" onClick={() => setAssignDriverModalVisible(false)}>
            Cancel
          </CButton>
          <CButton  size='sm' color="primary" onClick={assignDriver}>
            Assign Driver
          </CButton>
        </CModalFooter>
      </CModal>



    </>
  );
};

export default BookManageList;
