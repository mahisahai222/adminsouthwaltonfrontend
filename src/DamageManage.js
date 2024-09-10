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
import { faTrash, faPenToSquare, faComment } from '@fortawesome/free-solid-svg-icons';


const DamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vname, setVname] = useState('');
  const [vnumber, setVnumber] = useState('');
  const [damage, setDamage] = useState('');
  const [username, setUsername] = useState('');
  const [reason, setReason] = useState('');
  const [image, setImage] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [currentDamageId, setCurrentDamageId] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchDamageManageData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/damage');
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

  const handleAddDamageManage = async () => {
    const formData = new FormData();

    formData.append('vname', vname);
    formData.append('vnumber', vnumber);
    formData.append('damage', damage);
    formData.append('username', username);
    formData.append('reason', reason);

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/damage/add',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setDamageManageData([...damageManageData, response.data]);
      resetForm();
      setVisible(false);
      window.alert('Damage successfully added');
    } catch (error) {
      console.error('Error adding damage:', error);
    }
  };

  const handleEditDamageManage = (damage) => {
    setVname(damage.vname);
    setVnumber(damage.vnumber);
    setDamage(damage.damage);
    setUsername(damage.username);
    setReason(damage.reason);

    setEditMode(true);
    setCurrentDamageId(damage._id);
    setVisible(true);
  };

  const handleUpdateDamageManage = async () => {
    const formData = new FormData();

    formData.append('vname', vname);
    formData.append('vnumber', vnumber);
    formData.append('damage', damage);
    formData.append('username', username);
    formData.append('reason', reason);

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/damage/${currentDamageId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const updatedDamage = response.data;

      setDamageManageData(damageManageData.map((damage) =>
        damage._id === currentDamageId ? { ...damage, ...updatedDamage } : damage
      ));

      resetForm();
      setEditMode(false);
      setCurrentDamageId(null);
      setVisible(false);
      window.alert('Damage successfully updated');
    } catch (error) {
      console.error('Error updating damage manage:', error);
    }
  };

  const handleDeleteDamageManage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/damage/${id}`);
      setDamageManageData(damageManageData.filter((damage) => damage._id !== id));
      window.alert('Damage successfully deleted');
    } catch (error) {
      console.error('Error deleting damage manage:', error);
    }
  };

  const resetForm = () => {
    setVname('');
    setVnumber('');
    setDamage('');
    setUsername('');
    setReason('');
    setImage(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Damage Management</h1>
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
            {editMode ? 'Edit Damage' : 'Add Damage'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {damageManageData.length === 0 ? (
              <div className="no-data">No damage manage data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead color= 'dark'>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Vehicle Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Damage Occur</CTableHeaderCell>
                        <CTableHeaderCell scope="col">User Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {damageManageData.map((damage, index) => (
                        <CTableRow key={damage._id}>
                          <CTableDataCell>{damage.vname}</CTableDataCell>
                          <CTableDataCell>{damage.vnumber}</CTableDataCell>
                          <CTableDataCell>{damage.damage}</CTableDataCell>
                          <CTableDataCell>{damage.username}</CTableDataCell>
                          <CTableDataCell>{damage.reason}</CTableDataCell>
                          <CTableDataCell>
                            {damage.image && (
                              <img
                              src={`http://localhost:5000/uploads/${damage.image}`}
                              alt="Damage"
                              style={{ width: '100px', height: 'auto' }}
                            />
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                           
                            onClick={() => handleDeleteDamageManage(damage._id)}
                            className="me-2"
                          >
                            <FontAwesomeIcon icon={faTrash} style={{ color: '#bb1616'}} />
                          </CButton>
                          <CButton
                            
                            onClick={() => handleEditDamageManage(damage)}
                            className="me-2"
                          >
                            <FontAwesomeIcon icon={faPenToSquare}  style={{ color: '#b3ae0f'}} />
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
        <CModalTitle>{editMode ? 'Edit Damage' : 'Add Damage'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow>
            <CCol md={6}>
              <CFormLabel htmlFor="vname">Vehicle Name</CFormLabel>
              <CFormInput
                type="text"
                id="vname"
                value={vname}
                onChange={(e) => setVname(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="vnumber">Vehicle Number</CFormLabel>
              <CFormInput
                type="text"
                id="vnumber"
                value={vnumber}
                onChange={(e) => setVnumber(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <CFormLabel htmlFor="damage">Damage Occur</CFormLabel>
              <CFormInput
                type="text"
                id="damage"
                value={damage}
                onChange={(e) => setDamage(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="username">User Name</CFormLabel>
              <CFormInput
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={12}>
              <CFormLabel htmlFor="reason">Reason</CFormLabel>
              <CFormInput
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={12}>
              <CFormLabel htmlFor="image">Image</CFormLabel>
              <CFormInput
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
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
          onClick={editMode ? handleUpdateDamageManage : handleAddDamageManage}
        >
          {editMode ? 'Update' : 'Add'}
        </CButton>
      </CModalFooter>
    </CModal>
  </>
);
};

export default DamageManage;

