import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
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

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get('http://44.196.64.110:5001/api/request/');
      console.log('API response:', response.data); // Debugging response
      // Ensure feedbackData is correctly set from response.data
      setFeedbackData(Array.isArray(response.data.data) ? response.data.data : []); 
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setFeedbackData([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://44.196.64.110:5001/api/request/${id}`);
      setFeedbackData(feedbackData.filter((feedback) => feedback._id !== id));
      window.alert('Feedback successfully deleted');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <CCard className="d-flex w-100">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h1 style={{ fontSize: '24px', color: 'indianred' }}>Feedback Management</h1>
      </CCardHeader>
      <CCardBody>
        <CCardText>
          {feedbackData.length === 0 ? (
            <div className="no-data">No feedback data found.</div>
          ) : (
            <CTable hover bordered striped responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Comments</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {feedbackData.map((feedback) => (
                  <CTableRow key={feedback._id}>
                    <CTableDataCell>{feedback.name}</CTableDataCell>
                    <CTableDataCell>{feedback.email}</CTableDataCell>
                    <CTableDataCell>{new Date(feedback.startDate).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>{new Date(feedback.endDate).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>{feedback.comment}</CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: '#bb1616', cursor: 'pointer' }}
                        onClick={() => handleDeleteFeedback(feedback._id)}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardText>
      </CCardBody>
    </CCard>
  );
};

export default Feedback;
