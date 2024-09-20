import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CCardText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Sign = () => {
  const [signatureData, setSignatureData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch signature data from backend API
    const fetchSignatureData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sign');
        console.log('Signature Data:', response.data);
        
        setSignatureData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching signature data:', error);
        setLoading(false);
      }
    };

    fetchSignatureData();
  }, []);

  const handleDeleteSignature = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sign/${id}`);
      setSignatureData(signatureData.filter((sig) => sig._id !== id));
      window.alert('Signature successfully deleted');
    } catch (error) {
      console.error('Error deleting signature:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'purple' }}>Signature List</h1>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {signatureData.length === 0 ? (
              <div className="no-data">No signature data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Signature</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {signatureData.map((signature) => (
                        <CTableRow key={signature._id}>
                          <CTableDataCell>{signature.name}</CTableDataCell>
                          <CTableDataCell>
                          <img
                              src={signature.signatureData}
                              alt="Signature"
                              style={{ width: '100px', height: 'auto' }}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteSignature(signature._id)}
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
    </>
  );
};

export default Sign;
