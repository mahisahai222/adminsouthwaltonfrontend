import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
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
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CCardText,
  CButton,
  CTable,
  CTableHead,
  CTableDataCell,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
} from '@coreui/react';
import './UserManageList.css'; // Import CSS file for styling

const UserManageList = () => {
  const [userManageData, setUserManageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('Deactive');
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // Fetch user data from the backend
  const fetchUserManageData = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:8132/api/user/');
      console.log("Fetched data:", response.data);

      if (Array.isArray(response.data.data)) {
        setUserManageData(response.data.data);
      } else {
        console.error('Data fetched is not an array:', response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user manage data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserManageData();
  }, []);

  // Add user
  const handleAddUserManage = async () => {
    const formData = new FormData();
    
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNumber', phoneNumber);
    formData.append('state', state);
    formData.append('status', status);

    try {
      const response = await axios.post('http://3.111.163.2:8132/api/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // fetchUserManageData();
      setUserManageData([...userManageData, response.data]);
      window.alert('User successfully added');
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update user
  const handleUpdateUserManage = async () => {
    const formData = new FormData();
    
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNumber', phoneNumber);
    formData.append('state', state);
    formData.append('status', status);

    try {
      const response = await axios.put(`http://3.111.163.2:8132/api/user/${editUserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserManageData(userManageData.map(user => user._id === editUserId ? response.data : user));
      window.alert('User successfully updated');
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle add/update
  const handleAddOrUpdateUserManage = () => {
    if (editing) {
      handleUpdateUserManage();
    } else {
      handleAddUserManage();
    }
  };

  // Delete user
  const handleDeleteUserManage = async (id) => {
    try {
      await axios.delete(`http://3.111.163.2:8132/api/user/${id}`);
      setUserManageData(userManageData.filter(user => user._id !== id));
      window.alert('User successfully deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Set form values for editing
  const handleEditUserManage = (user) => {
   
    setFullName(user.fullName);
    setEmail(user.email);
    setPassword(user.password);
    setPhoneNumber(user.phoneNumber);
    setState(user.state);
    setStatus(user.status);
    setEditUserId(user._id);
    setEditing(true);
    setVisible(true);
  };

 
 // Activate or deactivate user
const handleToggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'Active' ? 'Deactive' : 'Active';
  const data = { id, status: newStatus };

  try {
    const response = await axios.post('http://3.111.163.2:8132/api/user/status', data);
    console.log("Status update response:", response.data);

    // Ensure the response contains the updated user data
    if (response.data && response.data.data && response.data.data._id) {
      setUserManageData(userManageData.map(user => user._id === id ? response.data.data : user));
      window.alert('User status updated successfully');
    } else {
      console.error('Unexpected response format:', response.data);
      window.alert('Failed to update user status');
    }
    fetchUserManageData();
  } catch (error) {
    console.error('Error updating user status:', error);
    window.alert('Failed to update user status');
  }
};


  // Reset form fields
  const resetForm = () => {
  
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setState('');
    setStatus('');
    setVisible(false);
    setEditing(false);
    setEditUserId(null);
    // Optionally refetch data to ensure the latest list
    fetchUserManageData();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'thistle' }}>User Manage List</h1>
          <CButton
            color="primary"
            size="sm"
            className="me-md-2"
            onClick={() => {
              resetForm(); // Ensure form is reset before opening modal
              setVisible(true);
            }}
          >
            ADD USERS
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {userManageData.length === 0 ? (
              <div className="no-data">No user data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Mobile No.</CTableHeaderCell>
                        <CTableHeaderCell scope="col">State</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {userManageData.map((user) => (
                        <CTableRow key={user._id}>
                        
                          <CTableDataCell>{user.fullName}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>{user.password}</CTableDataCell>
                          <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                          <CTableDataCell>{user.state}</CTableDataCell>
                          <CTableDataCell>
                            {user.isActive === 'Active' ? 'ACTIVE' : 'INACTIVE'}
                            <CButton
                              size="sm"
                              color={user.isActive=== 'Active' ? 'danger' : 'success'}
                              onClick={() => handleToggleStatus(user._id, user.isActive)}
                              className="ms-2"
                            >
                              {user.isActive === 'Active' ? 'Deactive' : 'Active'}
                            </CButton>
                          </CTableDataCell>

                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: "#aaad10", cursor: "pointer", marginRight: "10px" }}
                              onClick={() => handleEditUserManage(user)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: "#f00000", cursor: "pointer" }}
                              onClick={() => handleDeleteUserManage(user._id)}
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

      {/* Modal for adding/editing user */}
      <CModal
        visible={visible}
        onClose={() => {
          resetForm();
        }}
      >
        <CModalHeader>
          <CModalTitle>{editing ? 'Edit User' : 'Add User'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <CFormLabel htmlFor="fullName">Name</CFormLabel>
                <CFormInput
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="userEmail">Email</CFormLabel>
                <CFormInput
                  id="userEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="userPassword">Password</CFormLabel>
                <CFormInput
                  id="userPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                />
              </CCol>

            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormLabel htmlFor="phoneNumber">Mobile Number</CFormLabel>
                <CFormInput
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter mobile number"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="userState">State</CFormLabel>
                <CFormInput
                  id="userState"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter state"
                />
              </CCol>
            </CRow>
            <CFormLabel htmlFor="userStatus">Status</CFormLabel>
            <CFormSelect
              id="userStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Deactive">Deactive</option>
              <option value="Active">Active</option>
            </CFormSelect>
           
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => resetForm()}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddOrUpdateUserManage}>
            {editing ? 'Update User' : 'Add User'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UserManageList;
