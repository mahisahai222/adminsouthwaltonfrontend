import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CFormInput, CRow, CCol } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const BookManageList = () => {
  const [bookings, setBookings] = useState([]);
  const [visible, setVisible] = useState(false);
  const [viewOnlyVisible, setViewOnlyVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bname, setBname] = useState('');
  const [bphone, setBphone] = useState('');
  const [bemail, setBemail] = useState('');
  const [bsize, setBsize] = useState('');
  const [baddress, setBaddress] = useState('');
  const [baddressh, setBaddressh] = useState('');
  const [bpickup, setBpickup] = useState('');
  const [bdrop, setBdrop] = useState('');
  const [bpickDate, setBpickDate] = useState('');
  const [bdropDate, setBdropDate] = useState('');
  const [searchName, setSearchName] = useState('');

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAHWgq2_Us0Dq7UcVoP4FRGYcDqDh6XH_M', 
    libraries,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/book');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const handlePlaceChanged = (field, ref) => {
    const place = ref.current.getPlace();
    if (place) {
      if (field === 'pickupLocation') {
        setBpickup(place.formatted_address || '');
      } else if (field === 'dropLocation') {
        setBdrop(place.formatted_address || '');
      }
    }
  };

  const filteredBookings = Array.isArray(bookings)
    ? bookings.filter(booking => booking.bname.toLowerCase().includes(searchName.toLowerCase()))
    : [];

  const viewBookingDetails = (booking) => {
    setCurrentBooking(booking);
    setBname(booking.bname || '');
    setBphone(booking.bphone || '');
    setBemail(booking.bemail || '');
    setBsize(booking.bsize || '');
    setBaddress(booking.baddress || '');
    setBaddressh(booking.baddressh || '');
    setBpickup(booking.bpickup || '');
    setBdrop(booking.bdrop || '');
    setBpickDate(booking.bpickDate || '');
    setBdropDate(booking.bdropDate || '');
    setViewOnlyVisible(true);
  };

  const addBooking = async () => {
    try {
      const newBooking = {
        bname,
        bphone,
        bemail,
        bsize,
        baddress,
        baddressh,
        bpickup,
        bdrop,
        bpickDate,
        bdropDate
      };
      await axios.post('http://localhost:5000/api/book/create', newBooking);
      fetchBookings();
      setVisible(false);
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  const validateForm = () => {
    if (!bname || !bemail || !bsize || !baddress || !baddressh) {
      alert('Please fill all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    editMode ? updateBooking() : addBooking();
  };

  const handleEditBookManage = (booking) => {
    setCurrentBooking(booking);
    setBname(booking.bname);
    setBphone(booking.bphone);
    setBemail(booking.bemail);
    setBsize(booking.bsize);
    setBaddress(booking.baddress);
    setBaddressh(booking.baddressh);
    setBpickup(booking.bpickup);
    setBdrop(booking.bdrop);
    setBpickDate(booking.bpickDate);
    setBdropDate(booking.bdropDate);
    setVisible(true);
    setEditMode(true);
  };

  const updateBooking = async () => {
    try {
      const updatedBooking = {
        bname,
        bphone,
        bemail,
        bsize,
        baddress,
        baddressh,
        bpickup,
        bdrop,
        bpickDate,
        bdropDate
      };
      await axios.put(`http://localhost:5000/api/book/${currentBooking._id}`, updatedBooking);
      fetchBookings();
      setVisible(false);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/book/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const openModal = (booking = null) => {
    if (booking) {
      setEditMode(true);
      setCurrentBooking(booking);
      setBname(booking.bname);
      setBphone(booking.bphone);
      setBemail(booking.bemail);
      setBsize(booking.bsize);
      setBaddress(booking.baddress);
      setBaddressh(booking.baddressh);
      setBpickup(booking.bpickup);
      setBdrop(booking.bdrop);
      setBpickDate(booking.bpickDate);
      setBdropDate(booking.bdropDate);
    } else {
      setEditMode(false);
      setCurrentBooking(null);
      setBname('');
      setBphone('');
      setBemail('');
      setBsize('');
      setBaddress('');
      setBaddressh('');
      setBpickup('');
      setBdrop('');
      setBpickDate('');
      setBdropDate('');
    }
    setVisible(true);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Book Order List</h1>
          <CForm className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={handleSearchChange}
              className="me-2"
              style={{ width: '180px' }}
            />
            <CButton color="primary" onClick={() => openModal()} style={{ padding: '6px 10px' }}>
              Add Bookings
            </CButton>
          </CForm>
        </CCardHeader>
        <CCardBody>
          {bookings.length === 0 ? (
            <p>No bookings available</p>
          ) : (
            <CTable hover bordered striped responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Rental Address</CTableHeaderCell>
                  <CTableHeaderCell>From Location</CTableHeaderCell>
                  <CTableHeaderCell>To Location</CTableHeaderCell>
                  <CTableHeaderCell>Date From</CTableHeaderCell>
                  <CTableHeaderCell>Date To</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredBookings.map((booking) => (
                  <CTableRow key={booking._id}>
                    <CTableDataCell>{booking.bname}</CTableDataCell>
                    <CTableDataCell>{booking.baddress}</CTableDataCell>
                    <CTableDataCell>{booking.bpickup}</CTableDataCell>
                    <CTableDataCell>{booking.bdrop}</CTableDataCell>
                    <CTableDataCell>{booking.bpickDate}</CTableDataCell>
                    <CTableDataCell>{booking.bdropDate}</CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEditBookManage(booking)}
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                      />
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
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Booking' : 'Add Booking'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <CFormInput
                  label="Name"
                  value={bname}
                  onChange={(e) => setBname(e.target.value)}
                />
                <CFormInput
                  label="Phone"
                  value={bphone}
                  onChange={(e) => setBphone(e.target.value)}
                />
                <CFormInput
                  label="Email"
                  value={bemail}
                  onChange={(e) => setBemail(e.target.value)}
                />
                <CFormInput
                  label="Size"
                  value={bsize}
                  onChange={(e) => setBsize(e.target.value)}
                />
                <CFormInput
                  label="Address"
                  value={baddress}
                  onChange={(e) => setBaddress(e.target.value)}
                />
                <CFormInput
                  label="Address (House)"
                  value={baddressh}
                  onChange={(e) => setBaddressh(e.target.value)}
                />
                <Autocomplete
                  onLoad={(autocomplete) => (pickupRef.current = autocomplete)}
                  onPlaceChanged={() => handlePlaceChanged('pickupLocation', pickupRef)}
                >
                  <CFormInput
                    label="Pickup Location"
                    value={bpickup}
                    onChange={(e) => setBpickup(e.target.value)}
                  />
                </Autocomplete>
                <Autocomplete
                  onLoad={(autocomplete) => (dropRef.current = autocomplete)}
                  onPlaceChanged={() => handlePlaceChanged('dropLocation', dropRef)}
                >
                  <CFormInput
                    label="Drop Location"
                    value={bdrop}
                    onChange={(e) => setBdrop(e.target.value)}
                  />
                </Autocomplete>
                <CFormInput
                  label="Pickup Date"
                  type="date"
                  value={bpickDate}
                  onChange={(e) => setBpickDate(e.target.value)}
                />
                <CFormInput
                  label="Drop Date"
                  type="date"
                  value={bdropDate}
                  onChange={(e) => setBdropDate(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editMode ? 'Update Booking' : 'Add Booking'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={viewOnlyVisible}
        onClose={() => setViewOnlyVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Booking Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Name:</strong> {currentBooking?.bname}</p>
          <p><strong>Phone:</strong> {currentBooking?.bphone}</p>
          <p><strong>Email:</strong> {currentBooking?.bemail}</p>
          <p><strong>Size:</strong> {currentBooking?.bsize}</p>
          <p><strong>Address:</strong> {currentBooking?.baddress}</p>
          <p><strong>Address (House):</strong> {currentBooking?.baddressh}</p>
          <p><strong>Pickup Location:</strong> {currentBooking?.bpickup}</p>
          <p><strong>Drop Location:</strong> {currentBooking?.bdrop}</p>
          <p><strong>Pickup Date:</strong> {currentBooking?.bpickDate}</p>
          <p><strong>Drop Date:</strong> {currentBooking?.bdropDate}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewOnlyVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default BookManageList;
