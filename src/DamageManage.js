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

const DamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDamage, setSelectedDamage] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchDamageManageData = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:5000/api/damage');
      setDamageManageData(response.data);
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
      await axios.delete(`http://3.111.163.2:5000/api/damage/${id}`);
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
      // Pass the selected damage's transactionId to the backend for refund processing
      const response = await axios.post(`http://3.111.163.2:5000/api/damage/${selectedDamage._id}/process-refund`, {
        transactionId: selectedDamage.transactionId
      });
      alert(`Refund processed successfully: ${response.data.message}`);
      
      // Update the UI to reflect the refund status
      setDamageManageData(damageManageData.map((damage) =>
        damage._id === selectedDamage._id ? { ...damage, refunded: true } : damage
      ));
      setVisible(false); // Close the modal after refund
    } catch (error) {
      console.error('Error processing refund:', error.response ? error.response.data : error.message);
      alert('Failed to process refund. ' + (error.response ? error.response.data.message : error.message));
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
                        <CTableHeaderCell scope="col">Transaction ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Is Damage?</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Comment</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {damageManageData.map((damage) => (
                        <CTableRow key={damage._id}>
                          <CTableDataCell>{damage.transactionId || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{damage.vnumber}</CTableDataCell>
                          <CTableDataCell>{damage.damage ? 'Yes' : 'No'}</CTableDataCell>
                          <CTableDataCell>{damage.reason}</CTableDataCell>
                          <CTableDataCell>
                            {damage.images && damage.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={`http://3.111.163.2:5000/uploads/${img}`}
                                alt="Damage"
                                style={{ width: '100px', height: 'auto', marginRight: '5px' }}
                              />
                            ))}
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
