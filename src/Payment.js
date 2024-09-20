import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem
} from '@coreui/react';

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch payment data from MongoDB API
  const fetchPaymentData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pay/pays'); // Updated MongoDB endpoint
      console.log('API Response:', response.data);
      setPaymentData(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  useEffect(() => {
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = paymentData.slice(startIndex, endIndex);
    setDisplayData(paginatedData);
    setTotalPages(Math.ceil(paymentData.length / itemsPerPage));
  }, [paymentData, currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Payment Management</h1>
        </CCardHeader>
        <CCardBody>
          {displayData.length === 0 ? (
            <div>No payment data found.</div>
          ) : (
            <>
              <CTable hover bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Booking Id</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {displayData.map((payment) => (
                    <CTableRow key={payment._id}> {/* Use _id as unique key */}
                      <CTableDataCell>{payment._id}</CTableDataCell> {/* MongoDB's unique ID */}
                      <CTableDataCell>{(payment.amount / 100).toFixed(2)} USD</CTableDataCell>
                      <CTableDataCell>{payment.transactionId || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{payment.email || 'N/A'}</CTableDataCell> {/* Adjusted field for email */}
                      
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination aria-label="Page navigation">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <CPaginationItem
                    key={pageNumber + 1}
                    active={pageNumber + 1 === currentPage}
                    onClick={() => handlePageChange(pageNumber + 1)}
                  >
                    {pageNumber + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  );
};

export default Payment;
