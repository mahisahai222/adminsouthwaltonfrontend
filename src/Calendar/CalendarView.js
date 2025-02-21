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
      const response = await axios.get('http://54.236.98.193:8132/api/book/calendar');
      console.log("API Response:", response);

      if (response.data) {
        const events = response.data.data.map(eventData => ({
          id: eventData.paymentId,
          title: eventData.bookingDetails?.bname || 'No Title',
          email: eventData.bookingDetails?.bemail || 'No Title',
          start: new Date(eventData.reservationDetails?.pickdate),
          end: new Date(eventData.reservationDetails?.dropdate),
          pickup: eventData.reservationDetails?.pickup,
          drop: eventData.reservationDetails?.drop,
          vname: eventData.reservationDetails.vehicle?.vname,
          tagNumber: eventData.reservationDetails.vehicle?.tagNumber,
          passenger: eventData.reservationDetails.vehicle?.passenger,

          ...eventData,
        }));
        // console.log("Mapped Events:", events); 
        setMyEvents(events);
        console.log(events)
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

      <CModal visible={modalOpen} onClose={handleModalClose} size="md">
        <CModalHeader closeButton>
          <CModalTitle>View Booking Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEvent && (
            <CForm>
              {/* Customer Details */}
              <h5 className="mb-3" style={{ fontWeight: 'bold', color: '#0066b2' }}>Customer Details</h5>
              <CRow className="mb-4">
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Name</CFormLabel>
                  <p>{selectedEvent.title || 'N/A'}</p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Email</CFormLabel>
                  <p>{selectedEvent.email || 'N/A'}</p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Pick Date</CFormLabel>
                  <p>
                    {selectedEvent.start
                      ? new Date(selectedEvent.start).toLocaleString()
                      : 'N/A'}
                  </p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Drop Date</CFormLabel>
                  <p>
                    {selectedEvent.end
                      ? new Date(selectedEvent.end).toLocaleString()
                      : 'N/A'}
                  </p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Pick Up</CFormLabel>
                  <p>{selectedEvent.pickup || 'N/A'}</p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Drop</CFormLabel>
                  <p>{selectedEvent.drop || 'N/A'}</p>
                </CCol>
              </CRow>

              {/* Vehicle Details */}
              <h5 className="mb-3"style={{ fontWeight: 'bold', color: '#0066b2' }}>Vehicle Details</h5>
              <CRow className="mb-4">
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Vehicle Name</CFormLabel>
                  <p>{selectedEvent.vname || 'N/A'}</p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Tag Number</CFormLabel>
                  <p>{selectedEvent.tagNumber || 'N/A'}</p>
                </CCol>
                <CCol sm={6}>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Passenger</CFormLabel>
                  <p>{selectedEvent.passenger || 'N/A'}</p>
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
