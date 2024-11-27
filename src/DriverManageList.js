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
  const [image, setImage] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [bookingDetails, setBookingDetails] = useState([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImage(files); // Store selected files as an array
  };


  const fetchDriverBookings = async (driverId) => {
    try {
      const response = await axios.get(`http://44.196.64.110:8132/api/driver/${driverId}/bookings`);
      setBookingDetails(response.data.driver.bookings);  // Set the booking data
      console.log('Fetched bookings:', response.data.driver.bookings); // For debugging
    } catch (error) {
      console.error('Error fetching driver bookings:', error);
    }
  };


  useEffect(() => {
    console.log('Updated bookingDetails:', bookingDetails); // Log state after it's updated
  }, [bookingDetails]);



  const handleViewBookings = async (driverId) => {
    await fetchDriverBookings(driverId);
    setBookingModalVisible(true); // Assuming this shows a modal for booking details
  };




  const fetchDriverManageData = async () => {
    try {
      const response = await axios.get('http://44.196.64.110:8132/api/driver');
      setDriverManageData(response.data.drivers);
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
    if (image && image.length > 0) {
      image.forEach((file, index) => formData.append('images', file));
    }


    try {
      const response = await axios.post(
        'http://44.196.64.110:8132/api/driver/add',
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
    setImage([]);
    setExistingImages(item.image || []);
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
    if (image && image.length > 0) {
      image.forEach((file) => formData.append('images', file));
    } else if (existingImages && existingImages.length > 0) {
      existingImages.forEach((img) => formData.append('images', img));
    }

    try {
      const response = await axios.put(
        `http://44.196.64.110:8132/api/driver/${currentDriverId}`,
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
      await axios.delete(`http://44.196.64.110:8132/api/driver/${id}`);
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
                        {/* <CTableHeaderCell scope="col">View Bookings</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredDrivers.map((driver) => (
                        <CTableRow key={driver._id}>
                          <CTableDataCell>
                            {driver.images && driver.images.length > 0 ? (
                              driver.images.map((imgSrc, index) => (
                                <img
                                  key={index}
                                  src={imgSrc}
                                  alt={`driver ${index + 1}`} // Adjust alt text as needed
                                  style={{ width: '100px', marginRight: '10px' }} // Adjust size and spacing as needed
                                />
                              ))
                            ) : (
                              <span>No images available</span>
                            )}
                          </CTableDataCell>


                          <CTableDataCell>{driver.name}</CTableDataCell>
                          <CTableDataCell>{driver.mobileNumber}</CTableDataCell>
                          <CTableDataCell>{driver.email}</CTableDataCell>
                          <CTableDataCell>{driver.password}</CTableDataCell>
                          <CTableDataCell>{driver.address}</CTableDataCell>
                          {/* <CTableDataCell>
                            <CButton
                              size="lg"
                              className="me-2"
                              onClick={() => handleViewBookings(driver._id)}
                            >
                              <FontAwesomeIcon icon={faEye} style={{ color: '#b772ca', cursor: 'pointer', marginRight: '10px' }} />
                            </CButton>

                          </CTableDataCell> */}
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

      <CModal visible={bookingModalVisible} onClose={() => setBookingModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Booking Details</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <CTable striped hover bordered responsive>
            <CTableHead>
              <CTableRow>
                <CTableDataCell>Name</CTableDataCell>
                <CTableDataCell>Phone</CTableDataCell>
                <CTableDataCell>Email</CTableDataCell>
                <CTableDataCell>Size</CTableDataCell>
                <CTableDataCell>Pickup</CTableDataCell>
                <CTableDataCell>Drop</CTableDataCell>
                <CTableDataCell>Pick Date</CTableDataCell>
                <CTableDataCell>Drop Date</CTableDataCell>
                <CTableDataCell>Status</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {bookingDetails.length > 0 ? (
                bookingDetails.map((booking) => (
                  <CTableRow key={booking.id}>

                    <CTableDataCell>{booking.name}</CTableDataCell>

                    <CTableDataCell>{booking.phone}</CTableDataCell>

                    <CTableDataCell>{booking.email}</CTableDataCell>

                    <CTableDataCell>{booking.size}</CTableDataCell>

                    <CTableDataCell>{booking.pickup}</CTableDataCell>

                    <CTableDataCell>{booking.drop}</CTableDataCell>

                    <CTableDataCell>{booking.pickDate}</CTableDataCell>

                    <CTableDataCell>{booking.dropDate}</CTableDataCell>

                    <CTableDataCell>{booking.status}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="2">No booking details available.</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBookingModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>


    </>
  );
};

export default DriverManageList;
