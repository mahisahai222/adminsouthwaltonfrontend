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
  const [customerDriverDetails, setCustomerDriverDetails] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://18.209.197.35:8132/api/book');
      if (response?.data && Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  

  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.get('http://18.209.197.35:8132/api/driver/'); // Update API endpoint if necessary
      setAvailableDrivers(response.data.data); // Adjust if your response structure is different
    } catch (error) {
      console.error("Error fetching drivers:", error.message);
    }
  };

  const viewBookingDetails = async (booking) => {
    console.log("Selected Booking:", booking);
    setCurrentBooking(booking);
    console.log("Current Booking after setting:", booking);
    await fetchAvailableDrivers();
    setCustomerDriverDetails(booking.customerDrivers); 
    setViewOnlyVisible(true);
  };
  



  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://18.209.197.35:8132/api/book/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const assignDriver = async () => {
    if (!currentDriver || !currentBooking) {
      console.error("Driver or Booking not selected. Current Booking:", currentBooking, "Current Driver:", currentDriver);
      return;
    }
  
    const bookingId = currentBooking.bookingDetails.bookingId;  
    if (!bookingId) {
      console.error("Booking ID is missing for the selected booking.");
      return;
    }
  
    const requestData = {
      bookingId: bookingId,  
      driverId: currentDriver,
      paymentId: currentBooking.paymentId || null,
    };
  
    console.log("Assigning driver with data:", requestData);
    try {
      const response = await axios.post('http://18.209.197.35:8132/api/driver/assignDriver', requestData);
      window.alert('Driver assigned successfully!')
      console.log("Response from server:", response.data);
      setAssignDriverModalVisible(false);
      setCurrentDriver('');
      setCurrentBooking(null);
      fetchBookings();
    } catch (error) {
      console.error("Error assigning driver:", error.response ? error.response.data : error.message);
      alert('Error assigning driver: ' + (error.response?.data?.message || error.message));
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

    <h5>Customer Driver Details:</h5>
    {currentBooking?.bookingDetails.customerDrivers && currentBooking.bookingDetails.customerDrivers.length > 0 ? (
      currentBooking.bookingDetails.customerDrivers.map((driver, index) => (
        <div key={index}>
          <p><strong>Name:</strong> {driver.dname}</p>
          <p><strong>Phone:</strong> {driver.dphone}</p>
          <p><strong>Email:</strong> {driver.demail}</p>
          <p><strong>Experience:</strong> {driver.dexperience}</p>
          <p><strong>License:</strong> <a href={driver.dlicense} target="_blank" rel="noopener noreferrer">View License</a></p>
          <p><strong>Policy:</strong> <a href={driver.dpolicy} target="_blank" rel="noopener noreferrer">View Policy</a></p>
        </div>
      ))
    ) : (
      <p>No driver details available.</p>
    )}
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setViewOnlyVisible(false)}>
      Close
    </CButton>
    <CButton size="sm" onClick={() => { setAssignDriverModalVisible(true); fetchAvailableDrivers(); }}>
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
