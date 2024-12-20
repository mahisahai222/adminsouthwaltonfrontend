
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react';

const CustDamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDamageManageData = async () => {
    try {
      const response = await axios.get('http://44.196.64.110:8132/api/customer-damages/');
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
      await axios.delete(`http://44.196.64.110:8132/api/customer-damages/${id}`);
      setDamageManageData(damageManageData.filter((damage) => damage._id !== id));
      window.alert('Customer damage successfully deleted');
    } catch (error) {
      console.error('Error deleting damage manage:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <CCard className="d-flex 100%">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h1 style={{ fontSize: '24px', color: 'dodgerblue' }}>Customer Damage Management</h1>
      </CCardHeader>
      <CCardBody>
        <CCardText>
          {damageManageData.length === 0 ? (
            <div className="no-data">No customer damage data found.</div>
          ) : (
            <CRow>
              <CCol>
                <CTable hover bordered striped responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Payment ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DReasons</CTableHeaderCell>
                      <CTableHeaderCell scope="col">AReasons</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {damageManageData.map((damage) => (
                      <CTableRow key={damage._id}>
                        <CTableDataCell>{damage._id}</CTableDataCell>
                        <CTableDataCell>{damage.paymentId}</CTableDataCell>
                        <CTableDataCell>{damage.description}</CTableDataCell>
                        <CTableDataCell>{damage.DReasons.join(', ')}</CTableDataCell>
                        <CTableDataCell>{damage.AReasons.join(', ')}</CTableDataCell>
                        <CTableDataCell>
                          {damage.images && damage.images.length > 0 && (
                            <img
                              src={damage.images[0]}
                              alt="Damage"
                              style={{ width: '100px', height: 'auto' }}
                            />
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            onClick={() => handleDeleteDamageManage(damage._id)}
                            color="danger"
                          >
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
  );
};

export default CustDamageManage;
