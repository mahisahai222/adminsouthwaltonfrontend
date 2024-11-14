import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CCard,
  CFormSelect ,
  CCardBody,
  CCardHeader,
  CCardText,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const VehicleManageList = () => {
  const [vehicleManageData, setVehicleManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vname, setVname] = useState('');
  const [vseats, setVseats] = useState('');
  const [vprice, setVprice] = useState({
    peakSeason: { fourPassenger: {}, sixPassenger: {}, eightPassenger: {} },
    offSeason: { fourPassenger: {}, sixPassenger: {}, eightPassenger: {} },
    secondarySeason: { fourPassenger: {}, sixPassenger: {}, eightPassenger: {} },
  });
  const [season, setSeason] = useState('');
  const [duration, setDuration] = useState('');
  const [passengerType, setPassengerType] = useState('');
  const [price, setPrice] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [dailyPrices, setDailyPrices] = useState(Array(7).fill(''));


  const fetchVehicleManageData = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:8132/api/vehicle');
      setVehicleManageData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle manage data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleManageData();
  }, []);

  const handleAddVehicleManage = async () => {
    const formData = new FormData();
    formData.append('vname', vname);
    formData.append('vseats', vseats);
    formData.append('vprice', JSON.stringify(vprice));
    
    if (image) {
      formData.append('image', image); 
    }
  
    try {
      const response = await axios.post('http://44.196.192.232:8132/api/vehicle/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVehicleManageData([...vehicleManageData, response.data]); // Add new vehicle to list
      resetForm();
      setVisible(false);
      window.alert('Vehicle successfully added');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };
  

  const handleEditVehicleManage = (vehicle) => {
    setVname(vehicle.vname);
    setVseats(vehicle.vseats);
    setVprice(vehicle.vprice);
    setEditMode(true);
    setCurrentVehicleId(vehicle._id);
    setVisible(true);
  };

  const handleUpdateVehicleManage = async () => {
    const formData = new FormData();
    formData.append('vname', vname);
    formData.append('vseats', vseats);
    formData.append('vprice', JSON.stringify(vprice));

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(`http://44.196.192.232:8132/api/vehicle/${currentVehicleId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedVehicle = response.data;

      setVehicleManageData(vehicleManageData.map((vehicle) =>
        vehicle._id === currentVehicleId ? { ...vehicle, ...updatedVehicle } : vehicle
      ));

      resetForm();
      setEditMode(false);
      setCurrentVehicleId(null);
      setVisible(false);
      window.alert('Vehicle successfully updated');
    } catch (error) {
      console.error('Error updating vehicle manage:', error);
    }
  };

  const handleDeleteVehicleManage = async (id) => {
    try {
      await axios.delete(`http://44.196.192.232:8132/api/vehicle/${id}`);
      setVehicleManageData(vehicleManageData.filter((vehicle) => vehicle._id !== id));
      window.alert('Vehicle successfully deleted');
    } catch (error) {
      console.error('Error deleting vehicle manage:', error);
    }
  };

  const resetForm = () => {
    setVname('');
    setVseats('');
    setVprice({
      peakSeason: { fourPassenger: {}, sixPassenger: {}, eightPassenger: {} },
      offSeason: { fourPassenger: {}, sixPassenger: {}, eightPassenger: {} },
      secondarySeason: { fourPassenger: {}, sixPassenger: {}, eightPassenger: {} },
    });
    setSeason('');
    setDuration('');
    setPassengerType('');
    setPrice('');
  };


  const handlePriceUpdate = () => {
    if (season && passengerType && duration && price) {
      setVprice((prev) => ({
        ...prev,
        [season]: {
          ...prev[season],
          [passengerType]: {
            ...prev[season][passengerType],
            [duration]: price,
          },
        },
      }));
      setDuration('');
      setPrice('');
    }
  };
  



  const handleShowPriceTable = (vehicle) => {
    setSelectedVehicle(vehicle);
    setPriceModalVisible(true); // Show price modal when season is selected
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Golf Cart Management</h1>
          <CButton
            color="primary"
            size="sm"
            className="me-md-2"
            onClick={() => {
              resetForm();
              setEditMode(false);
              setVisible(true);
            }}
          > 
            {editMode ? 'Edit Vehicle' : 'Add Vehicle'}
          </CButton>
        </CCardHeader>
        <CCardBody>
  <CCardText>
    {vehicleManageData.length === 0 ? (
      <div className="no-data">No vehicle manage data found.</div>
    ) : (
      <CRow>
        <CCol>
          <CTable hover bordered striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Vehicle Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Vehicle Seats</CTableHeaderCell>
                <CTableHeaderCell scope="col">Off Season Price</CTableHeaderCell>
                <CTableHeaderCell scope="col">Secondary Season Price</CTableHeaderCell>
                <CTableHeaderCell scope="col">Peak Season Price</CTableHeaderCell>
               
                <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vehicleManageData.map((vehicle) => (
                <CTableRow key={vehicle._id}>
                  <CTableDataCell>{vehicle.vname}</CTableDataCell>
                  <CTableDataCell>{vehicle.passenger}</CTableDataCell>
                  <CTableDataCell>{vehicle.prices?.offSeason}</CTableDataCell>
                  <CTableDataCell>{vehicle.prices?.secondarySeason}</CTableDataCell>
                  <CTableDataCell>{vehicle.prices?.peakSeason}</CTableDataCell>
                  
                  <CTableDataCell>
                    {vehicle.image && (
                      <img
                        src={`http://44.196.192.232:8132/uploads/${vehicle.image}`}
                        alt={vehicle.vname}
                        style={{ width: '100px' }}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                      onClick={() => handleEditVehicleManage(vehicle)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: '#bb1616', cursor: 'pointer' }}
                      onClick={() => handleDeleteVehicleManage(vehicle._id)}
                    />
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
{/* 
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm>
            <CFormLabel>Vehicle Name</CFormLabel>
            <CFormInput value={vname} onChange={(e) => setVname(e.target.value)} />

            <CFormLabel>Seats</CFormLabel>
            <CFormInput value={vseats} onChange={(e) => setVseats(e.target.value)} />

            <CFormSelect value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="">Select Season</option>
            <option value="offSeason">Off Season</option>
            <option value="secondarySeason">Secondary Season</option>
            <option value="peakSeason">Peak Season</option>
          </CFormSelect>
            <CFormSelect value={passengerType} onChange={(e) => setPassengerType(e.target.value)}>
            <option value="">Select Passenger Type</option>
            <option value="fourPassenger">4 Passengers</option>
            <option value="sixPassenger">6 Passengers</option>
            <option value="eightPassenger">8 Passengers</option>
          </CFormSelect>
          <CFormSelect value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option>Select Duration</option>
              <option value="oneDay">One Day</option>
              <option value="twoDays">Two Days</option>
              <option value="twoDays">Two Days</option>
              <option value="threeDays">Two Days</option>
              <option value="fourDays">Two Days</option>
              <option value="fiveDays">Two Days</option>
              <option value="sixDays">Two Days</option>
              <option value="weeklyRental">Weekly</option>
          
            </CFormSelect>

            <CFormLabel>Price</CFormLabel>
            <CFormInput type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

            <CButton onClick={handlePriceUpdate}>Add Price</CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={editMode ? handleUpdateVehicleManage : handleAddVehicleManage}>
            {editMode ? 'Update' : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal> */}
<CModal visible={visible} onClose={() => setVisible(false)}>
  <CModalHeader>
    <CModalTitle>{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
      <CFormLabel>Vehicle Name</CFormLabel>
      <CFormInput value={vname} onChange={(e) => setVname(e.target.value)} />

      {/* <CFormSelect value={season} onChange={(e) => setSeason(e.target.value)}>
        <option value="">Select Season</option>
        <option value="offSeason">Off Season</option>
        <option value="secondarySeason">Secondary Season</option>
        <option value="peakSeason">Peak Season</option>
      </CFormSelect> */}

      <CFormSelect value={passengerType} onChange={(e) => setPassengerType(e.target.value)}>
        <option value="">Select Passenger Type</option>
        <option value="fourPassenger">4 Passengers</option>
        <option value="sixPassenger">6 Passengers</option>
        <option value="eightPassenger">8 Passengers</option>
      </CFormSelect>

      {/* Price Table */}
      <CFormLabel>Daily Prices</CFormLabel>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Day</th>
            <th>Peak Season</th>
            <th>Off Season</th>
            <th>Mid Season</th>
            <th>No Season</th>
          </tr>
        </thead>
        <tbody>
          {dailyPrices.map((price, index) => (
            <tr key={index}>
              <td>Day {index + 1}</td>
              <td>
                <CFormInput
                  type="number"
                  value={price.peakSeason}
                  onChange={(e) => handleDailyPriceChange(index, 'peakSeason', e.target.value)}
                  placeholder={`Peak Season for Day ${index + 1}`}
                />
              </td>
              <td>
                <CFormInput
                  type="number"
                  value={price.offSeason}
                  onChange={(e) => handleDailyPriceChange(index, 'offSeason', e.target.value)}
                  placeholder={`Off Season for Day ${index + 1}`}
                />
              </td>
              <td>
                <CFormInput
                  type="number"
                  value={price.midSeason}
                  onChange={(e) => handleDailyPriceChange(index, 'midSeason', e.target.value)}
                  placeholder={`Mid Season for Day ${index + 1}`}
                />
              </td>
              <td>
                <CFormInput
                  type="number"
                  value={price.noSeason}
                  onChange={(e) => handleDailyPriceChange(index, 'noSeason', e.target.value)}
                  placeholder={`No Season for Day ${index + 1}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
    <CButton color="primary" onClick={editMode ? handleUpdateVehicleManage : handleAddVehicleManage}>
      {editMode ? 'Update' : 'Add'}
    </CButton>
  </CModalFooter>
</CModal>

      <CModal visible={priceModalVisible} onClose={() => setPriceModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{season} Price Table</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable hover bordered striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                <CTableHeaderCell scope="col">Four Passenger</CTableHeaderCell>
                <CTableHeaderCell scope="col">Six Passenger</CTableHeaderCell>
                <CTableHeaderCell scope="col">Eight Passenger</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>One Day</CTableDataCell>
                <CTableDataCell>{vprice[season]?.oneDay || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.oneDay || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.oneDay || 0}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Two Days</CTableDataCell>
                <CTableDataCell>{vprice[season]?.twoDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.twoDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.twoDays || 0}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Three Days</CTableDataCell>
                <CTableDataCell>{vprice[season]?.threeDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.threeDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.threeDays || 0}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Four Days</CTableDataCell>
                <CTableDataCell>{vprice[season]?.fourDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.fourDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.fourDays || 0}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Five Days</CTableDataCell>
                <CTableDataCell>{vprice[season]?.fiveDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.fiveDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.fiveDays || 0}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Six Days</CTableDataCell>
                <CTableDataCell>{vprice[season]?.sixDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.sixDays || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.sixDays || 0}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Weekly Rental</CTableDataCell>
                <CTableDataCell>{vprice[season]?.weeklyRental || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.weeklyRental || 0}</CTableDataCell>
                <CTableDataCell>{vprice[season]?.weeklyRental || 0}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPriceModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default VehicleManageList;
