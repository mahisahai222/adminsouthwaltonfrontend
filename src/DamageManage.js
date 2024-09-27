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


const stripePromise = loadStripe('pk_test_51PsifGP6k3IQ77YBnQ4FXQCCb548b6cL50JVVuZxBRHqrkwxMfmcBTDGclAqwnVFiNtSvtNHgOPGxhJzlQjzrPPr00i340x8H3'); // Use your Stripe publishable key

const DamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDamage, setSelectedDamage] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchDamageManageData = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:8132/api/damage');
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
      await axios.delete(`http://44.196.192.232:8132/api/damage/${id}`);
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
      const stripe = await stripePromise; // Get Stripe instance

      const response = await axios.post(`http://44.196.192.232:8132/api/damage/refund/${selectedDamage._id}`, {
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
      const response = await axios({
        url: `http://44.196.192.232:8132/api/damage/report/${damageId}`,
        method: 'GET',
        responseType: 'blob', // Important for downloading the file
      });

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `damage_report_${damageId}.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Remove the link element after triggering download
    } catch (error) {
      console.error('Error generating PDF:', error);
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
                          <CTableDataCell>{damage.bookingId || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{damage.transactionId}</CTableDataCell>
                          <CTableDataCell>{damage.damage}</CTableDataCell>

                          <CTableDataCell>
                            {damage.images && damage.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={`http://44.196.192.232:8132/uploads/${img}`}
                                alt="Damage"
                                style={{ width: '100px', height: 'auto', marginRight: '5px' }}
                              />
                            ))}
                          </CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faFilePdf}
                              style={{ cursor: 'pointer', color: '#abd025' }}
                              onClick={() => handleGeneratePDF(damage._id)}
                            />
                          </CTableDataCell>

                          <CTableDataCell className="d-flex justify-content-start align-items-center">
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

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Refund</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to process a 25% refund for the selected damage record?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={confirmRefund}>
            Confirm Refund
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DamageManage;
