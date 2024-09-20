import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CCardText,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faEye } from '@fortawesome/free-solid-svg-icons';

const DriverManageList = () => {
  const [driverManageData, setDriverManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [bookingDetails, setBookingDetails] = useState([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const fetchDriverBookings = async (driverId) => {
    try {
      const response = await axios.get(`http://3.111.163.2:8132/api/driver/${driverId}/bookings`);
      setBookingDetails(response.data.driver.bookings);
      setBookingModalVisible(true);
    } catch (error) {
      console.error('Error fetching driver bookings:', error);
    }
  };


  const handleViewBookings = async (driverId) => {
    await fetchDriverBookings(driverId);
    setBookingModalVisible(true); // Assuming this shows a modal for booking details
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };



  const fetchDriverManageData = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:8132/api/driver');
      setDriverManageData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching driver manage data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverManageData();
  }, []);

  const handleAddDriverManage = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('mobileNumber', mobileNumber);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('address', address);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(
        'http://3.111.163.2:8132/api/driver/add',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      // setDriverManageData([...driverManageData, response.data]);
      fetchDriverManageData()
      resetForm();
      setVisible(false);
      window.alert('Driver successfully added');
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const handleEditDriverManage = (driver) => {
    setName(driver.name);
    setMobileNumber(driver.mobileNumber);
    setEmail(driver.email);
    setPassword(driver.password);
    setAddress(driver.address);
    setEditMode(true);
    setCurrentDriverId(driver._id);
    setVisible(true);
  };

  const handleUpdateDriverManage = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('mobileNumber', mobileNumber);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('address', address);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(
        `http://3.111.163.2:8132/api/driver/${currentDriverId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const updatedDriver = response.data;
      setDriverManageData(driverManageData.map((driver) =>
        driver._id === currentDriverId ? { ...driver, ...updatedDriver } : driver
      ));
      fetchDriverManageData();
      resetForm();
      setEditMode(false);
      setCurrentDriverId(null);
      setVisible(false);
      window.alert('Driver successfully updated');
    } catch (error) {
      console.error('Error updating driver manage:', error);
    }
  };

  const handleDeleteDriverManage = async (id) => {
    try {
      await axios.delete(`http://3.111.163.2:8132/api/driver/${id}`);
      setDriverManageData(driverManageData.filter((driver) => driver._id !== id));
      window.alert('Driver successfully deleted');
    } catch (error) {
      console.error('Error deleting driver manage:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const filteredDrivers = Array.isArray(driverManageData)
    ? driverManageData.filter(driver =>
      driver.name.toLowerCase().includes(searchName.toLowerCase())
    )
    : [];

  const resetForm = () => {

    setName('');
    setMobileNumber('');
    setEmail('');
    setPassword('');
    setAddress('');
    setImage(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Driver Management</h1>
          <div className="d-flex align-items-center">
            <CButton
              color="primary"
              size="sm"
              className="me-3"
              onClick={() => {
                resetForm();
                setEditMode(false);
                setVisible(true);
              }}
            >
              Add Driver
            </CButton>
            <CFormInput
              size="sm"
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchChange}
              className="ms-3"
              style={{ width: '180px', marginRight: "0rem" }}
            />
          </div>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {filteredDrivers.length === 0 ? (
              <div className="no-data">No driver manage data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Profile</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredDrivers.map((driver) => (
                        <CTableRow key={driver._id}>
                          <CTableDataCell>
                            {driver.image && (
                              <img
                                src={`http://3.111.163.2:8132/api/driver/image/${driver.image.filename}`}
                                alt={driver.name}
                                style={{ width: '50px', height: '50px' }}
                              />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{driver.name}</CTableDataCell>
                          <CTableDataCell>{driver.mobileNumber}</CTableDataCell>
                          <CTableDataCell>{driver.email}</CTableDataCell>
                          <CTableDataCell>{driver.password}</CTableDataCell>
                          <CTableDataCell>{driver.address}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="lg"
                              className="me-2"
                              onClick={() => handleViewBookings(driver._id)}
                            >
                              <FontAwesomeIcon icon={faEye} style={{ color: '#b772ca', cursor: 'pointer', marginRight: '10px' }} />
                            </CButton>

                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditDriverManage(driver)}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }} />
                            </CButton>
                            <CButton
                              size="sm"
                              onClick={() => handleDeleteDriverManage(driver._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} style={{ color: '#bb1616', cursor: 'pointer' }} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            )}
          </CCardText>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Driver' : 'Add Driver'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="mobileNumber">Mobile Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="password">Password</CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormInput
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="image">Profile Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          {editMode ? (
            <CButton color="primary" onClick={handleUpdateDriverManage}>
              Save changes
            </CButton>
          ) : (
            <CButton color="primary" onClick={handleAddDriverManage}>
              Save changes
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      <CModal visible={bookingModalVisible} onClose={() => setBookingModalVisible(false)} size='lg' >
        <CModalHeader>
          <CModalTitle>Booking Details</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ width: '100%', margin: '0 auto' }}>
          <CTable hover bordered striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Pickup</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dropoff</CTableHeaderCell>
                <CTableHeaderCell scope="col">Pickup Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dropoff Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Size</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address home</CTableHeaderCell>
         </CTableRow>
            </CTableHead>
            <CTableBody>
              {bookingDetails.map((booking) => (
                <CTableRow key={booking._id}>
                  <CTableDataCell>{booking.bpickup}</CTableDataCell>
                  <CTableDataCell>{booking.bdrop}</CTableDataCell>
                  <CTableDataCell>{formatDate(booking.bpickDate)}</CTableDataCell>
                  <CTableDataCell>{formatDate(booking.bdropDate)}</CTableDataCell>
                  <CTableDataCell>{booking.bname}</CTableDataCell>
                  <CTableDataCell>{booking.bphone}</CTableDataCell>
                  <CTableDataCell>{booking.bemail}</CTableDataCell>
                  <CTableDataCell>{booking.bsize}</CTableDataCell>
                  <CTableDataCell>{booking.baddress}</CTableDataCell>
                  <CTableDataCell>{booking.baddressh}</CTableDataCell>
                  


                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBookingModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

    </>
  );
};

export default DriverManageList;
