

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import axios from 'axios';
import {
  CCard, CCardHeader, CCardBody, CCardText,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormLabel, CFormInput, CRow, CCol, CButton
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

// Configure date-fns localizer
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Event Component to highlight the title
const CustomEvent = ({ event }) => {
  const customEventStyle = {
    fontWeight: 'bold',
    color: 'pink',
    padding: '5px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 0, 9, 0.1)',
  };

  return <span style={customEventStyle}>{event.title}</span>;
};

const CalendarView = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch all events from the API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://3.111.163.2:8132/api/book');
      const events = response.data.map(eventData => ({
        id: eventData._id, // Assuming _id is the ID field from your API
        title: eventData.bname,
        start: new Date(eventData.bdropDate), 
        end: new Date(eventData.bdropDate),
        allDay: true,
        ...eventData
      }));
      setMyEvents(events);
    } catch (error) {
      console.error('Error fetching events data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details of a specific booking by ID
  const fetchEventDetails = async (id) => {
    try {
      const response = await axios.get(`http://3.111.163.2:8132/api/book/${id}`);
      setSelectedEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewDetails = (event) => {
    console.log("Event clicked:", event);
    fetchEventDetails(event.id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }}
        components={{
          event: CustomEvent
        }}
        onSelectEvent={handleViewDetails}
      />

      <CModal
        show={modalOpen}
        onClose={handleModalClose}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>View Event Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEvent && (
            <CForm>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel htmlFor="bname">Name</CFormLabel>
                  <CFormInput
                    id="bname"
                    name="bname"
                    value={selectedEvent.bname || ''}
                    readOnly
                  />
                </CCol>
                <CCol sm={6}>
                  <CFormLabel htmlFor="bphone">Phone</CFormLabel>
                  <CFormInput
                    id="bphone"
                    name="bphone"
                    value={selectedEvent.bphone || ''}
                    readOnly
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel htmlFor="bemail">Email</CFormLabel>
                  <CFormInput
                    id="bemail"
                    name="bemail"
                    value={selectedEvent.bemail || ''}
                    readOnly
                  />
                </CCol>
                <CCol sm={6}>
                  <CFormLabel htmlFor="bsize">Size</CFormLabel>
                  <CFormInput
                    id="bsize"
                    name="bsize"
                    value={selectedEvent.bsize || ''}
                    readOnly
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel htmlFor="baddress">Address</CFormLabel>
                  <CFormInput
                    id="baddress"
                    name="baddress"
                    value={selectedEvent.baddress || ''}
                    readOnly
                  />
                </CCol>
                <CCol sm={6}>
                  <CFormLabel htmlFor="baddressh">Address H</CFormLabel>
                  <CFormInput
                    id="baddressh"
                    name="baddressh"
                    value={selectedEvent.baddressh || ''}
                    readOnly
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel htmlFor="bpickup">Pickup</CFormLabel>
                  <CFormInput
                    id="bpickup"
                    name="bpickup"
                    value={selectedEvent.bpickup || ''}
                    readOnly
                  />
                </CCol>
                <CCol sm={6}>
                  <CFormLabel htmlFor="bdrop">Drop</CFormLabel>
                  <CFormInput
                    id="bdrop"
                    name="bdrop"
                    value={selectedEvent.bdrop || ''}
                    readOnly
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel htmlFor="bpickDate">Pickup Date</CFormLabel>
                  <CFormInput
                    id="bpickDate"
                    name="bpickDate"
                    type="date"
                    value={selectedEvent.bpickDate || ''}
                    readOnly
                  />
                </CCol>
                <CCol sm={6}>
                  <CFormLabel htmlFor="bdropDate">Drop Date</CFormLabel>
                  <CFormInput
                    id="bdropDate"
                    name="bdropDate"
                    type="date"
                    value={selectedEvent.bdropDate || ''}
                    readOnly
                  />
                </CCol>
              </CRow>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleModalClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CalendarView;

