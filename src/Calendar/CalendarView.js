import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import axios from 'axios';
import Select from 'react-select'; // Import React-Select
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormLabel, CFormInput, CRow, CCol, CButton,
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
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tagNumber, setTagNumber] = useState(null); // State for selected tagNumber
  const [tagOptions, setTagOptions] = useState([]); // State for all available tagNumber options

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://3.223.253.106:8132/api/book/calendar');
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

        const uniqueTagOptions = [
          { value: null, label: 'All Vehicles' },
          ...[...new Set(events.map(event => event.tagNumber))].map(tag => ({
            value: tag,
            label: tag,
          })),
        ];

        setMyEvents(events);
        setFilteredEvents(events);
        setTagOptions(uniqueTagOptions);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    } finally {
      setLoading(false);
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

  const handleFilterChange = (selectedOption) => {
    setTagNumber(selectedOption);
    if (selectedOption && selectedOption.value) {
      setFilteredEvents(myEvents.filter(event => event.tagNumber === selectedOption.value));
    } else {
      setFilteredEvents(myEvents);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      {/* Sidebar with Searchable Dropdown */}
      <div
        style={{
          width: '17%',
          background: "linear-gradient(45deg, #808080, rgb(255, 255, 255))",
          padding: "20px",
          borderRight: "1px solid #ccc",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
          color: "#333",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        <CRow className="mb-3">
          <CCol sm={12}>
            <Select
              options={tagOptions}
              value={tagNumber}
              onChange={handleFilterChange}
              isClearable
              placeholder="Search or select a vehicle"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#0066b2",
                  boxShadow: "0 2px 5px rgba(0, 102, 178, 0.5)",
                  '&:hover': {
                    borderColor: "#00509e",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#0066b2",
                  fontWeight: "600",
                }),
              }}
            />
          </CCol>
        </CRow>
      </div>
  
      {/* Main Content with Calendar */}
      <div style={{ width: '83%', padding: '20px' }}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: '100%' }}
          components={{
            event: CustomEvent,
          }}
          onSelectEvent={handleViewDetails}
        />
  
        {/* Modal */}
        <CModal visible={modalOpen} onClose={handleModalClose} size="lg">
          <CModalHeader closeButton>
            <CModalTitle>View Booking Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedEvent && (
              <CForm>
                {/* Customer Details */}
                <h5 className="mb-3" style={{ fontWeight: 'bold', color: '#0066b2' }}>
                  Customer Details
                </h5>
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
                <h5 className="mb-3" style={{ fontWeight: 'bold', color: '#0066b2' }}>
                  Vehicle Details
                </h5>
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
    </div>
  );
  
};

export default CalendarView;
