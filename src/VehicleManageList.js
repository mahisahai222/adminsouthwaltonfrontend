import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const VehicleManageList = () => {
  const [vehicleManageData, setVehicleManageData] = useState([])
  const [loading, setLoading] = useState(true)

  const [vname, setVname] = useState('')
  const [vcolor, setVcolor] = useState('')
  const [vnumber, setVnumber] = useState('')
  const [vseats, setVseats] = useState('')
  const [vprice, setVprice] = useState('')

  const [editMode, setEditMode] = useState(false)
  const [currentVehicleId, setCurrentVehicleId] = useState(null)
  const [image, setImage] = useState(null)
  const [visible, setVisible] = useState(false)

  const fetchVehicleManageData = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:5000/api/vehicle')
      setVehicleManageData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vehicle manage data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicleManageData()
  }, [])

  const handleAddVehicleManage = async () => {
    const formData = new FormData()

    formData.append('vname', vname)
    formData.append('vcolor', vcolor)
    formData.append('vnumber', vnumber)
    formData.append('vseats', vseats)
    formData.append('vprice', vprice)


    if (image) {
      formData.append('image', image)
    }

    try {
      const response = await axios.post(
        'http://3.111.163.2:5000/api/vehicle',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      setVehicleManageData([...vehicleManageData, response.data])
      resetForm()
      setVisible(false)
      window.alert('Vehicle successfully added')
    } catch (error) {
      console.error('Error adding vehicle:', error)
    }
  }

  const handleEditVehicleManage = (vehicle) => {

    setVname(vehicle.vname)
    setVcolor(vehicle.vcolor)
    setVnumber(vehicle.vnumber)
    setVseats(vehicle.vseats)
    setVprice(vehicle.vprice)

    setEditMode(true)
    setCurrentVehicleId(vehicle._id)
    setVisible(true)
  }


  
  const handleUpdateVehicleManage = async () => {
    const formData = new FormData()

    formData.append('vname', vname)
    formData.append('vcolor', vcolor)
    formData.append('vnumber', vnumber)
    formData.append('vseats', vseats)
    formData.append('vprice', vprice)


    if (image) {
      formData.append('image', image)
    }

    try {
      const response = await axios.put(
        `http://3.111.163.2:5000/api/vehicle/${currentVehicleId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      const updatedVehicle = response.data

      setVehicleManageData(vehicleManageData.map((vehicle) =>
        vehicle._id === currentVehicleId ? { ...vehicle, ...updatedVehicle } : vehicle
      ))

      resetForm()
      setEditMode(false)
      setCurrentVehicleId(null)
      setVisible(false)
      window.alert('Vehicle successfully updated')
    } catch (error) {
      console.error('Error updating vehicle manage:', error)
    }
  }

  const handleDeleteVehicleManage = async (id) => {
    try {
      await axios.delete(`http://3.111.163.2:5000/api/vehicle/${id}`)
      setVehicleManageData(vehicleManageData.filter((vehicle) => vehicle._id !== id))
      window.alert('Vehicle successfully deleted')
    } catch (error) {
      console.error('Error deleting vehicle manage:', error)
    }
  }

  const resetForm = () => {

    setVname('')
    setVcolor('')
    setVnumber('')
    setVseats('')
    setVprice('')

    setImage(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Golf Cart Management</h1>
          <CButton
            color="primary"
            size="sm"
            className="me-md-2"
            onClick={() => {
              resetForm()
              setEditMode(false)
              setVisible(true)
            }}
          >
            {editMode ? 'Edit Vehicle' : 'Add Vehicle'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {vehicleManageData.length === 0 ? (
              <div className="no-data">No vehicle manage data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Vehicle Name</CTableHeaderCell>
                        
                       
                        <CTableHeaderCell scope="col">Vehicle Seats</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {vehicleManageData.map((vehicle, index) => (
                        <CTableRow >
                         
                          <CTableDataCell>{vehicle.vname}</CTableDataCell>
                          
                          <CTableDataCell>{vehicle.vseats}</CTableDataCell>
                          <CTableDataCell>{vehicle.vprice}</CTableDataCell>
                          <CTableDataCell>
                            {vehicle.image && (
                              <img
                                src={`http://3.111.163.2:5000/uploads/${vehicle.image}`}
                                alt={vehicle.vname}
                                style={{ width: '100px' }}
                              />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                              onClick={() => handleEditVehicleManage(vehicle)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteVehicleManage(vehicle._id)}
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
          <CModalTitle>{editMode ? 'Edit Vehicle Manage' : 'Add Vehicle Manage'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vname" className="col-sm-3 col-form-label">
                Vehicle Name
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vname"
                  value={vname}
                  onChange={(e) => setVname(e.target.value)}
                />
              </CCol>
            </CRow>
          
           
            <CRow className="mb-3">
              <CFormLabel htmlFor="vseats" className="col-sm-3 col-form-label">
                Vehicle Seats
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vseats"
                  value={vseats}
                  onChange={(e) => setVseats(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vprice" className="col-sm-3 col-form-label">
                Vehicle Price
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vprice"
                  value={vprice}
                  onChange={(e) => setVprice(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="image" className="col-sm-3 col-form-label">
                Image
              </CFormLabel>
              <CCol sm="9">
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
            onClick={editMode ? handleUpdateVehicleManage : handleAddVehicleManage}
          >
            {editMode ? 'Update Vehicle Manage' : 'Add Vehicle Manage'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'purple' }}>Vehicle Manage List</h1>
          <CButton
            color="primary"
            size="sm"
            className="me-md-2"
            onClick={() => {
              resetForm()
              setEditMode(false)
              setVisible(true)
            }}
          >
            {editMode ? 'Edit Vehicle' : 'Add Vehicle'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {vehicleManageData.length === 0 ? (
              <div className="no-data">No vehicle manage data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Vehicle Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle Color</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle NuSeatsmber</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vehicle Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {vehicleManageData.map((vehicle, index) => (
                        <CTableRow key={vehicle._id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{vehicle.vname}</CTableDataCell>
                          <CTableDataCell>{vehicle.vcolor}</CTableDataCell>
                          <CTableDataCell>{vehicle.vnumber}</CTableDataCell>
                          <CTableDataCell>{vehicle.vseats}</CTableDataCell>
                          <CTableDataCell>{vehicle.vprice}</CTableDataCell>
                          <CTableDataCell>
                            {vehicle.image && (
                              <img
                                src={`http://3.111.163.2:5000/uploads/${vehicle.image}`}
                                alt={vehicle.vname}
                                style={{ width: '100px' }}
                              />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                              onClick={() => handleEditVehicleManage(vehicle)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteVehicleManage(vehicle._id)}
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
          <CModalTitle>{editMode ? 'Edit Vehicle Manage' : 'Add Vehicle Manage'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vname" className="col-sm-3 col-form-label">
                Vehicle Name
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vname"
                  value={vname}
                  onChange={(e) => setVname(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vcolor" className="col-sm-3 col-form-label">
                Vehicle Color
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vcolor"
                  value={vcolor}
                  onChange={(e) => setVcolor(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vnumber" className="col-sm-3 col-form-label">
                Vehicle Number
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vnumber"
                  value={vnumber}
                  onChange={(e) => setVnumber(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vseats" className="col-sm-3 col-form-label">
                Vehicle Seats
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vseats"
                  value={vseats}
                  onChange={(e) => setVseats(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="vprice" className="col-sm-3 col-form-label">
                Vehicle Price
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="vprice"
                  value={vprice}
                  onChange={(e) => setVprice(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="image" className="col-sm-3 col-form-label">
                Image
              </CFormLabel>
              <CCol sm="9">
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
            onClick={editMode ? handleUpdateVehicleManage : handleAddVehicleManage}
          >
            {editMode ? 'Update Vehicle Manage' : 'Add Vehicle Manage'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )

}

export default VehicleManageList
