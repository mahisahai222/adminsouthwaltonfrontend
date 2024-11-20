import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CImage,
} from '@coreui/react';
import axios from 'axios';

const VehicleManageList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vname: '',
    passenger: '',
    vprice: {
      offseason: {},
      secondaryseason: {},
      peakseason: {},
    },
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:8132/api/vehicle');
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleVpriceChange = (e, season, dayType) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      vprice: {
        ...prevData.vprice,
        [season]: {
          ...prevData.vprice[season],
          [dayType]: value,
        },
      },
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('vname', formData.vname);
    formDataObj.append('passenger', formData.passenger);
    formDataObj.append('vprice', JSON.stringify(formData.vprice));
    if (formData.image) formDataObj.append('image', formData.image);

    try {
      if (isEditing) {
        await axios.put(`http://44.196.192.232:8132/api/vehicle/${editVehicleId}`, formDataObj);
      } else {
        await axios.post('http://44.196.192.232:8132/api/vehicle/add', formDataObj);
      }
      fetchVehicles();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      vname: '',
      passenger: '',
      vprice: { offseason: {}, secondaryseason: {}, peakseason: {} },
      image: null,
    });
    setIsEditing(false);
    setEditVehicleId(null);
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vname: vehicle.vname,
      passenger: vehicle.passenger,
      vprice: vehicle.vprice,
      image: null,
    });
    setIsEditing(true);
    setEditVehicleId(vehicle._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://44.196.192.232:8132/api/vehicle/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleFormSubmit}>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Vehicle Name"
                  name="vname"
                  value={formData.vname}
                  onChange={handleInputChange}
                  required
                />
                <CFormSelect
                  name="passenger"
                  value={formData.passenger}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Passenger Capacity</option>
                  <option value="fourPassenger">Four Passengers</option>
                  <option value="sixPassenger">Six Passengers</option>
                  <option value="eightPassenger">Eight Passengers</option>
                </CFormSelect>
              </CInputGroup>

              <div>
                <h5>Vprice Details:</h5>
                {['offseason', 'secondaryseason', 'peakseason'].map((season) => (
                  <CRow key={season}>
                    <CCol md={4}>
                      <h6>{season.charAt(0).toUpperCase() + season.slice(1)}</h6>
                      {['oneDay', 'twoDays', 'threeDays', 'fourDays', 'fiveDays', 'sixDays', 'weeklyRental'].map((dayType) => (
                        <CFormInput
                          key={dayType}
                          placeholder={`${dayType} price`}
                          value={formData.vprice[season][dayType] || ''}
                          onChange={(e) => handleVpriceChange(e, season, dayType)}
                        />
                      ))}
                    </CCol>
                  </CRow>
                ))}
              </div>

              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="my-3"
              />
              <CButton type="submit" color="primary">
                {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
              </CButton>
              {isEditing && (
                <CButton color="secondary" onClick={resetForm} className="ms-2">
                  Cancel Edit
                </CButton>
              )}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>
            <strong>Vehicle List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Image</CTableHeaderCell>
                  <CTableHeaderCell>Vehicle Name</CTableHeaderCell>
                  <CTableHeaderCell>Passenger</CTableHeaderCell>
                  <CTableHeaderCell>Vprice</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vehicles.map((vehicle) => (
                  <CTableRow key={vehicle._id}>
                    <CTableDataCell>
                      {vehicle.image && <CImage src={vehicle.image[0]} width="100" />}
                    </CTableDataCell>
                    <CTableDataCell>{vehicle.vname}</CTableDataCell>
                    <CTableDataCell>{vehicle.passenger}</CTableDataCell>
                    <CTableDataCell>
                      <div>
                        Offseason: {JSON.stringify(vehicle.vprice.offseason)}
                        <br />
                        Secondary Season: {JSON.stringify(vehicle.vprice.secondaryseason)}
                        <br />
                        Peak Season: {JSON.stringify(vehicle.vprice.peakseason)}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" onClick={() => handleEdit(vehicle)} className="me-2">
                        Edit
                      </CButton>
                      <CButton color="danger" onClick={() => handleDelete(vehicle._id)}>
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default VehicleManageList;
