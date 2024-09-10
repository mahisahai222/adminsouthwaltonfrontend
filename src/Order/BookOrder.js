import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenSquare } from '@fortawesome/free-solid-svg-icons';

const BookOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchOrders();
    }, 300); 
  
    return () => clearTimeout(timer);
  }, [searchName]);
  const fetchOrders = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/Booking/',{searchName});
      const filteredOrders = response.data.map(order => ({
        _id: order._id,
        name: order.name,
        message: order.message,
        vnumber: order.vnumber,
        email: order.email,
        paymentStatus: order.paymentStatus,
      }));
      setOrders(filteredOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  // const searchOrders = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/Booking/', {searchName});

  //     console.log('Search Response:', response.data);
  //     const filteredOrders = response.data.map(order => ({
  //       _id: order._id,
  //       name: order.name,
  //       message: order.message,
  //       vnumber: order.vnumber,
  //       email: order.email,
  //       paymentStatus: order.paymentStatus,
  //     }));
  //     setOrders(filteredOrders);
  //   } catch (error) {
  //     console.error('Error searching orders:', error);
  //   }
  // };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Booking/${id}`);
      setOrders(orders.filter(order => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const editOrder = (order) => {
    setName(order.name);
    setEditMode(true);
    setCurrentOrderId(order._id);
    setVisible(true);
  };

  const updateOrder = async () => {
    const updatedOrder = {
      name: name,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/Booking/${currentOrderId}`,
        updatedOrder
      );
      setOrders(
        orders.map(order =>
          order._id === currentOrderId ? { ...order, ...response.data } : order
        )
      );
      setName('');
      setEditMode(false);
      setCurrentOrderId(null);
      setVisible(false);
      window.alert('Order successfully updated');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Book Order List</h1>
          <CForm className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={handleSearchChange}
              className="me-2"
            />
          </CForm>
        </CCardHeader>
        <CCardBody>
          {orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Message</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vehicle Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payment Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map(order => (
                  <CTableRow key={order._id}>
                    <CTableDataCell>{order.name}</CTableDataCell>
                    <CTableDataCell>{order.email}</CTableDataCell>
                    <CTableDataCell>{order.message}</CTableDataCell>
                    <CTableDataCell>{order.vnumber}</CTableDataCell>
                    <CTableDataCell>{order.paymentStatus}</CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faPenSquare}
                        style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => editOrder(order)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: '#bb1616', cursor: 'pointer' }}
                        onClick={() => deleteOrder(order._id)}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{editMode ? 'Edit Order' : 'Add Order'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={editMode ? updateOrder : null}>
            {editMode ? 'Update' : 'Add'}
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default BookOrder;
