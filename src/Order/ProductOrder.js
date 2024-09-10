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
import { faTrash, faPenToSquare, faSearch } from '@fortawesome/free-solid-svg-icons';

const ProductOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePaid, setPricePaid] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [searchBuyerName, setSearchBuyerName] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/productOrders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const searchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/productOrders?buyerName=${searchBuyerName}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error searching product orders:', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/productOrders/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error deleting product order:', error);
    }
  };

  const editOrder = (order) => {
    setProductName(order.productName);
    setQuantity(order.quantity);
    setPricePaid(order.pricePaid);
    setBuyerName(order.buyerName);
    setBuyerContact(order.buyerContact);
    setBuyerEmail(order.buyerEmail);
    setPaymentStatus(order.paymentStatus);
    setEditMode(true);
    setCurrentOrderId(order._id);
    setVisible(true);
  };

  const updateOrder = async () => {
    const updatedOrder = {
      productName,
      quantity,
      pricePaid,
      buyerName,
      buyerContact,
      buyerEmail,
      paymentStatus,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/productOrders/${currentOrderId}`,
        updatedOrder
      );
      setOrders(
        orders.map((order) =>
          order._id === currentOrderId ? { ...order, ...response.data } : order
        )
      );
      setProductName('');
      setQuantity('');
      setPricePaid('');
      setBuyerName('');
      setBuyerContact('');
      setBuyerEmail('');
      setPaymentStatus('');
      setEditMode(false);
      setCurrentOrderId(null);
      setVisible(false);
      window.alert('Product order successfully updated');
    } catch (error) {
      console.error('Error updating product order:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Product Order List</h1>
          <CForm className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by Buyer Name"
              value={searchBuyerName}
              onChange={(e) => setSearchBuyerName(e.target.value)}
              className="me-2"
            />
            <CButton color="primary" onClick={searchOrders}>
              <FontAwesomeIcon icon={faSearch} />
            </CButton>
          </CForm>
        </CCardHeader>
        <CCardBody>
          {orders.length === 0 ? (
            <div>No product orders found.</div>
          ) : (
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price Paid</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Buyer Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Buyer Contact</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Buyer Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payment Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((order) => (
                  <CTableRow key={order._id}>
                    <CTableDataCell>{order.productName}</CTableDataCell>
                    <CTableDataCell>{order.quantity}</CTableDataCell>
                    <CTableDataCell>{order.pricePaid}</CTableDataCell>
                    <CTableDataCell>{order.buyerName}</CTableDataCell>
                    <CTableDataCell>{order.buyerContact}</CTableDataCell>
                    <CTableDataCell>{order.buyerEmail}</CTableDataCell>
                    <CTableDataCell>{order.paymentStatus}</CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
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
          <CModalTitle>{editMode ? 'Edit Product Order' : 'Add Product Order'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={pricePaid}
                  onChange={(e) => setPricePaid(e.target.value)}
                  placeholder="Price Paid"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Buyer Name"
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={buyerContact}
                  onChange={(e) => setBuyerContact(e.target.value)}
                  placeholder="Buyer Contact"
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="Buyer Email"
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  placeholder="Payment Status"
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

export default ProductOrder;
