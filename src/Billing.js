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
import { faTrash, faPenToSquare, faDownload } from '@fortawesome/free-solid-svg-icons';

const Billing = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userID, setUserID] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [currentBillingId, setCurrentBillingId] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchBillingData = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:5000/api/billing');
      setBillingData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleAddBilling = async () => {
    try {
      const response = await axios.post('http://3.111.163.2:5000/api/billing/add', {
        userID,
        paymentStatus,
      });
      setBillingData([...billingData, response.data]);
      resetForm();
      setVisible(false);
      window.alert('Billing successfully added');
    } catch (error) {
      console.error('Error adding billing:', error);
    }
  };

  const handleEditBilling = (billing) => {
    setUserID(billing.userID);
    setPaymentStatus(billing.paymentStatus);

    setEditMode(true);
    setCurrentBillingId(billing._id);
    setVisible(true);
  };

  const handleUpdateBilling = async () => {
    try {
      const response = await axios.put(`http://3.111.163.2:5000/api/billing/${currentBillingId}`, {
        userID,
        paymentStatus,
      });
      const updatedBilling = response.data;

      setBillingData(
        billingData.map((billing) =>
          billing._id === currentBillingId ? { ...billing, ...updatedBilling } : billing
        )
      );

      resetForm();
      setEditMode(false);
      setCurrentBillingId(null);
      setVisible(false);
      window.alert('Billing successfully updated');
    } catch (error) {
      console.error('Error updating billing:', error);
    }
  };

  const handleDeleteBilling = async (id) => {
    try {
      await axios.delete(`http://3.111.163.2:5000/api/billing/${id}`);
      setBillingData(billingData.filter((billing) => billing._id !== id));
      window.alert('Billing successfully deleted');
    } catch (error) {
      console.error('Error deleting billing:', error);
    }
  };

  const handleDownload = (id) => {
    // Implement download functionality
    console.log('Download clicked for ID:', id);
  };

  const resetForm = () => {
    setUserID('');
    setPaymentStatus('');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'purple' }}>Billing List</h1>
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
            {editMode ? 'Edit Billing' : 'Add Billing'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {billingData.length === 0 ? (
              <div className="no-data">No billing data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Payment Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {billingData.map((billing) => (
                        <CTableRow key={billing._id}>
                          <CTableDataCell>{billing.userID}</CTableDataCell>
                          <CTableDataCell>{billing.paymentStatus}</CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                              onClick={() => handleEditBilling(billing)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer', marginRight: '10px' }}
                              onClick={() => handleDeleteBilling(billing._id)}
                            />
                            <FontAwesomeIcon
                              icon={faDownload}
                              style={{ color: '#63E6BE', cursor: 'pointer' }}
                              onClick={() => handleDownload(billing._id)}
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

      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Billing' : 'Add Billing'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="userID" className="col-sm-3 col-form-label">
                User ID
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="userID"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="paymentStatus" className="col-sm-3 col-form-label">
                Payment Status
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={editMode ? handleUpdateBilling : handleAddBilling}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Billing;
