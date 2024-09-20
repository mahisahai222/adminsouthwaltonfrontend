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
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchName, setSearchName] = useState('');

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:8132/api/feedback');
      setFeedbackData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const handleAddFeedback = async () => {
    const feedback = { name, email, startDate, endDate, comments };
  
    try {
      await axios.post('http://3.111.163.2:8132/api/feedback/add', feedback);
      fetchFeedbackData();
      resetForm();
      setVisible(false);
      window.alert('Feedback successfully added');
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };
  

  

 

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://3.111.163.2:8132/api/feedback/${id}`);
      setFeedbackData(feedbackData.filter((feedback) => feedback._id !== id));
      window.alert('Feedback successfully deleted');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const filteredFeedbacks = Array.isArray(feedbackData)
    ? feedbackData.filter(feedback =>
        feedback.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : [];

  const resetForm = () => {
    setName('');
    setEmail('');
    setStartDate('');
    setEndDate('');
    setComments('');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Feedback Management</h1>
          <div className="d-flex align-items-center">
            <CButton
              color="primary"
              size="sm"
              className="me-3"
              onClick={() => {
                resetForm();
                setEditMode(false);
                setVisible(true);
              }}
            >
              Add Feedback
            </CButton>
            <CFormInput
              size="sm"
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchChange}
              className="ms-3"
              style={{ width: '180px', marginRight: "0rem" }}
            />
          </div>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {filteredFeedbacks.length === 0 ? (
              <div className="no-data">No feedback data found.</div>
            ) : (
              <CRow>
                <CCol>
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
                      {filteredFeedbacks.map((feedback) => (
                        <CTableRow key={feedback._id}>
                          <CTableDataCell>{feedback.name}</CTableDataCell>
                          <CTableDataCell>{feedback.email}</CTableDataCell>
                          <CTableDataCell>{feedback.startDate}</CTableDataCell>
                          <CTableDataCell>{feedback.endDate}</CTableDataCell>
                          <CTableDataCell>{feedback.comments}</CTableDataCell>
                          <CTableDataCell>
                           
                          
                              <FontAwesomeIcon icon={faTrash} style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteFeedback(feedback._id)}/>
                            
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
          <CModalTitle>{editMode ? 'Edit Feedback' : 'Add Feedback'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="startDate">Start Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="endDate">End Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="comments">Comments</CFormLabel>
                <CFormInput
                  type="text"
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={editMode ? handleUpdateFeedback : handleAddFeedback}
          >
            {editMode ? 'Update Feedback' : 'Add Feedback'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Feedback;
