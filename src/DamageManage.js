import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CRow,
  CCol,
  CButton,
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
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const stripePromise = loadStripe('pk_test_51PsifGP6k3IQ77YBnQ4FXQCCb548b6cL50JVVuZxBRHqrkwxMfmcBTDGclAqwnVFiNtSvtNHgOPGxhJzlQjzrPPr00i340x8H3');

const DamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDamage, setSelectedDamage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [viewDamage, setViewDamage] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);

  const fetchDamageManageData = async () => {
    try {
      const response = await axios.get('http://18.209.197.35:8132/api/damage');
      console.log(response.data.data);
      setDamageManageData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching damage manage data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDamageManageData();
  }, []);

  const handleDeleteDamageManage = async (id) => {
    try {
      await axios.delete(`http://18.209.197.35:8132/api/damage/${id}`);
      setDamageManageData(damageManageData.filter((damage) => damage._id !== id));
      window.alert('Damage successfully deleted');
    } catch (error) {
      console.error('Error deleting damage manage:', error);
    }
  };

  const handleRefund = async (damage) => {
    setSelectedDamage(damage);
    setVisible(true);
  };

  const confirmRefund = async () => {
    if (!selectedDamage) return;

    try {
      const stripe = await stripePromise;

      const response = await axios.post(`http://18.209.197.35:8132/api/damage/refund/${selectedDamage._id}`, {
        transactionId: selectedDamage.transactionId,
      });

      if (response.data.refund) {
        alert(`Refund processed successfully: ${response.data.message}`);
        setDamageManageData(damageManageData.map((damage) =>
          damage._id === selectedDamage._id ? { ...damage, refunded: true } : damage
        ));
      }
      setVisible(false);
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Failed to process refund: ' + error.message);
    }
  };

  const handleGeneratePDF = async (damageId) => {
    try {
      const response = await axios.post('http://18.209.197.35:8132/api/damage/send-damage-report', { damageId }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `damage_report_${damageId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


  const handleViewDamage = async (damage) => {
    console.log("Viewing Damage ID:", damage._id);
    try {
      const response = await axios.get(`http://18.209.197.35:8132/api/damage/${damage._id}`);
      if (response.data.success) {
        setViewDamage(response.data.data);
        setViewVisible(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching damage details:', error);
    }
  };
  

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'dodgerblue' }}>Damage Management</h1>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {damageManageData.length === 0 ? (
              <div className="no-data">No damage manage data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Transaction ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Damage</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                        <CTableHeaderCell scope="col">pdf</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {damageManageData.map((damage) => (
                        <CTableRow key={damage._id}>
                          <CTableDataCell>{damage.bookingId}</CTableDataCell>
                          <CTableDataCell>{damage.transactionId}</CTableDataCell>
                          <CTableDataCell>{damage.damage}</CTableDataCell>
                          <CTableDataCell>
                            {damage.images && damage.images.length > 0 && (
                              <img
                                src={`http://18.209.197.35:8132/uploads/${damage.images[0]}`}
                                alt="Damage"
                                style={{ width: '100px', height: 'auto' }}
                              />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                          <CButton
                              color="success"
                              size='sm'
                              style={{ padding: '2px 6px', fontSize: '12px' }}
                              onClick={() => handleGeneratePDF(damage._id)}
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '10px' }} /> Generate PDF
                            </CButton>
                            <CButton size='sm' className="me-2" color="info" style={{ padding: '2px 6px', fontSize: '12px' }} >
                              Approve
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell className="d-flex justify-content-start align-items-center">
                            <CButton size='sm' className="me-2" color="info" onClick={() => handleViewDamage(damage)}>
                              View
                            </CButton>
                            <CButton size='sm' className="me-2" color="warning" onClick={() => handleRefund(damage)}>
                              Refund
                            </CButton>
                            <CButton size='sm' onClick={() => handleDeleteDamageManage(damage._id)} className="me-2" color="danger">
                              Delete
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

      {/* Refund Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Refund</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to refund the transaction {selectedDamage?.transactionId}?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={confirmRefund}>Confirm Refund</CButton>
        </CModalFooter>
      </CModal>

      {/* View Damage Modal */}
      <CModal visible={viewVisible} onClose={() => setViewVisible(false)}>
        <CModalHeader>
          <CModalTitle>Damage Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewDamage && (
            <div>
              <h5>Booking ID: {viewDamage.bookingId}</h5>
              <h5>Transaction ID: {viewDamage.transactionId}</h5>
              <h5>Damage Description: {viewDamage.damage}</h5>
              <h5>Booking Details:</h5>
              {viewDamage.bookingDetails && (
                <ul>
                  <li>Pickup: {viewDamage.bookingDetails.bpickup}</li>
                  <li>Drop-off: {viewDamage.bookingDetails.bdrop}</li>
                  <li>Pickup Date: {viewDamage.bookingDetails.bpickDate}</li>
                  <li>Drop-off Date: {viewDamage.bookingDetails.bdropDate}</li>
                  <li>Name: {viewDamage.bookingDetails.bname}</li>
                  <li>Phone: {viewDamage.bookingDetails.bphone}</li>
                  <li>Email: {viewDamage.bookingDetails.bemail}</li>
                  <li>Address: {viewDamage.bookingDetails.baddress}</li>
                  <li>Additional Address: {viewDamage.bookingDetails.baddressh}</li>
                </ul>
              )}
              <h5>Vehicle Details:</h5>
              {viewDamage.vehicleDetails && (
                <ul>
                  <li>Name: {viewDamage.vehicleDetails.vname}</li>
                  <li>Seats: {viewDamage.vehicleDetails.vseats}</li>
                  <li>Price: {viewDamage.vehicleDetails.vprice}</li>
                </ul>
              )}
              {viewDamage.images && viewDamage.images.length > 0 && (
                <img
                  src={`http://18.209.197.35:8132/uploads/${viewDamage.images[0]}`}
                  alt="Damage"
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DamageManage;
