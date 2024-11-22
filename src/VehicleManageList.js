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
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const VehicleManageList = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vname, setVname] = useState('');
  const [passenger, setPassenger] = useState('');
  const [vprice, setVprice] = useState([]); 
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [vehiclePrice, setVehiclePrice] = useState('');

  const fetchVehicleData = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:8132/api/vehicle');
      setVehicleData(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const handleAddVehicle = async () => {
    const formData = new FormData();
    formData.append('vname', vname);
    formData.append('passenger', passenger);
    formData.append('vprice', JSON.stringify(vprice)); 
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://44.196.192.232:8132/api/vehicle/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchVehicleData();
      resetForm();
      setVisible(false);
      window.alert('Vehicle successfully added');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setVname(vehicle.vname);
    setPassenger(vehicle.passenger);
    setVprice(vehicle.vprice);
    setImage(null); 
    setEditMode(true);
    setCurrentVehicleId(vehicle._id);
    setVisible(true);  
  };
  

  const handleUpdateVehicle = async () => {
    const formData = new FormData();
    formData.append('vname', vname);
    formData.append('passenger', passenger);
    formData.append('vprice', JSON.stringify(vprice));
    if (image) {
      formData.append('image', image);  // Include image if it's updated
    }
  
    try {
      const response = await axios.put(`http://44.196.192.232:8132/api/vehicle/${currentVehicleId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const updatedVehicle = response.data;
      // Update the vehicle list with the newly updated vehicle
      setVehicleData(vehicleData.map((vehicle) =>
        vehicle._id === currentVehicleId ? { ...vehicle, ...updatedVehicle } : vehicle
      ));
      fetchVehicleData();  // Optional: Fetch the updated data again
      resetForm();
      setEditMode(false);
      setCurrentVehicleId(null);
      setVisible(false);
      window.alert('Vehicle successfully updated');
    } catch (error) {
      console.error('Error updating vehicle data:', error);
    }
  };
  
  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://44.196.192.232:8132/api/vehicle/${id}`);
      setVehicleData(vehicleData.filter((vehicle) => vehicle._id !== id));
      window.alert('Vehicle successfully deleted');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleViewPrice = (vehicleId) => {
    const vehicle = vehicleData.find((vehicle) => vehicle._id === vehicleId);
    if (vehicle && Array.isArray(vehicle.vprice) && vehicle.vprice.length > 0) {
      setVehiclePrice(vehicle.vprice);
      setPriceModalVisible(true);
    } else {
      setVehiclePrice([]); 
      setPriceModalVisible(true);
    }
  };


  const resetForm = () => {
    setVname('');
    setPassenger('');
    setVprice('');
    setImage(null);
  };

  const handleAddPrice = () => {
    // Make sure vprice is an array before adding new price data
    if (Array.isArray(vprice)) {
      setVprice([...vprice, { season: '', day: '', price: '' }]);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const newPrices = [...vprice];
    newPrices[index][field] = value;
    setVprice(newPrices);
  };

  const handleDeletePrice = (index) => {
    const newPrices = [...vprice];
    newPrices.splice(index, 1);
    setVprice(newPrices);
  };


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Vehicle Management</h1>
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
              Add Vehicle
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {vehicleData.length === 0 ? (
              <div className="no-data">No vehicle data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Profile</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Passenger</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {vehicleData.map((vehicle) => (
                        <CTableRow key={vehicle._id}>
                          <CTableDataCell>
                            {vehicle.image && vehicle.image.length > 0 ? (
                              vehicle.image.map((imgSrc, index) => (
                                <img
                                  key={index}
                                  src={imgSrc}
                                  alt={`${vehicle.name} ${index + 1}`}
                                  style={{ width: '100px', marginRight: '10px' }}
                                />
                              ))
                            ) : (
                              <span>No images available</span>
                            )}
                          </CTableDataCell>

                          <CTableDataCell>{vehicle.vname}</CTableDataCell>
                          <CTableDataCell>{vehicle.passenger}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color='info'
                              className="me-2"
                              onClick={() => handleViewPrice(vehicle._id)}
                            >
                              View Price
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} style={{ color: '#b3ae0f', cursor: 'pointer' }} />
                            </CButton>
                            <CButton
                              size="sm"
                              onClick={() => handleDeleteVehicle(vehicle._id)}
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

      {/* Price Modal */}
      <CModal visible={priceModalVisible} onClose={() => setPriceModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Vehicle Price</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {vehiclePrice && vehiclePrice.length > 0 ? (
            vehiclePrice.map((priceData, index) => (
               <div key={index} style={{ marginBottom: '20px' }}>
                <div  style={{ marginBottom: '10px' }}>Season: {priceData.season || 'No season available'}</div>
                <div  style={{ marginBottom: '10px' }}>Day: {priceData.day || 'No day available'}</div>
                <div  style={{ marginBottom: '10px' }}>Price: {priceData.price ? `$${priceData.price}` : 'No price available'}</div>
                <hr />
              </div>
            ))
          ) : (
            <div>No price data available</div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPriceModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>


      {/* Add/Edit Vehicle Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="vname">Name</CFormLabel>
                <CFormInput
                  id="vname"
                  value={vname}
                  onChange={(e) => setVname(e.target.value)}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="passenger">Passenger</CFormLabel>
                <CFormInput
                  id="passenger"
                  value={passenger}
                  onChange={(e) => setPassenger(e.target.value)}
                />
              </CCol>

              {/* Price Section */}
              <CCol xs={12}>
                <CFormLabel htmlFor="vprice">Price</CFormLabel>
                <div>
                  {vprice.map((priceData, index) => (
                    <div key={index}>
                      <CFormInput
                        value={priceData.season}
                        onChange={(e) => handlePriceChange(index, 'season', e.target.value)}
                        placeholder="Season"
                      />
                      <CFormInput
                        value={priceData.day}
                        onChange={(e) => handlePriceChange(index, 'day', e.target.value)}
                        placeholder="Day"
                      />
                      <CFormInput
                        type="number"
                        value={priceData.price}
                        onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                        placeholder="Price"
                      />
                      <CButton size='sm' color="danger" onClick={() => handleDeletePrice(index)}>
                        Remove Price
                      </CButton>
                    </div>
                  ))}
                  <CButton size='sm' color="success" onClick={handleAddPrice}>
                    Add Price
                  </CButton>
                </div>
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                <CFormInput
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={editMode ? handleUpdateVehicle : handleAddVehicle}
          >
            {editMode ? 'Update' : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default VehicleManageList;
