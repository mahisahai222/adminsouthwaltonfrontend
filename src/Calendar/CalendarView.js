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

  const fetchEvents = async () => {
    try {
      console.log("Fetching events...");
      const response = await axios.get('http://44.196.64.110:8132/api/book');
      console.log("API Response:", response);

      if (response.data) {
        const events = response.data.map(eventData => ({
          id: eventData.paymentId,
          title: eventData.bookingDetails?.bname || 'No Title',
          start: new Date(eventData.reservationDetails?.dropdate),
          end: new Date(eventData.reservationDetails?.dropdate),
          allDay: true,
          ...eventData,
        }));
        // console.log("Mapped Events:", events); 
        setMyEvents(events);
      } else {
        console.error("No data in API response:", response);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    } finally {
      setLoading(false);
      // console.log("Fetch complete."); 
    }
  };


  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
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
        visible={modalOpen}
        onClose={handleModalClose}
        size="md"
      >
        <CModalHeader closeButton>
          <CModalTitle>View Event Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEvent && (
            <CForm>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel>Payment ID</CFormLabel>
                  <p>{selectedEvent.id || 'N/A'}</p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel>Title</CFormLabel>
                  <p>{selectedEvent.title || 'N/A'}</p>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel>Start Date</CFormLabel>
                  <p>
                    {selectedEvent.start
                      ? new Date(selectedEvent.start).toLocaleString()
                      : 'N/A'}
                  </p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel>End Date</CFormLabel>
                  <p>
                    {selectedEvent.end
                      ? new Date(selectedEvent.end).toLocaleString()
                      : 'N/A'}
                  </p>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormLabel>All Day</CFormLabel>
                  <p>{selectedEvent.allDay ? 'Yes' : 'No'}</p>
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
