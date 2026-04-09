import { useState, useEffect } from 'react';
import ReservationsPage from './ReservationsPage';
import OrdersPage from './OrdersPage';

const API_URL = '/api';

function App() {
  const [activePage, setActivePage] = useState('reservations');
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    nombreCliente: '',
    correoCliente: '',
    fecha: '',
    hora: '',
    servicioId: '',
  });

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filter, activePage]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();
      setServices(data);
    } catch {
      showMessage('Error al cargar servicios', 'error');
    }
  };

  const fetchAppointments = async () => {
    try {
      const url = filter === 'ALL'
        ? `${API_URL}/appointments`
        : `${API_URL}/appointments?estado=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setAppointments(data);
    } catch {
      showMessage('Error al cargar órdenes', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCliente: form.nombreCliente,
          correoCliente: form.correoCliente,
          fecha: form.fecha,
          hora: form.hora,
          servicioId: parseInt(form.servicioId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage(data.error || 'Error al procesar reserva', 'error');
        return;
      }
      showMessage('Reserva confirmada con éxito');
      setForm({ nombreCliente: '', correoCliente: '', fecha: '', hora: '', servicioId: '' });
      fetchAppointments();
      // Redirect to orders to see the new reservation? No, stay on page but show success.
    } catch {
      showMessage('Error de conexión al servidor', 'error');
    }
  };

  const updateStatus = async (id, estado) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage(data.error || 'Error al actualizar estado', 'error');
        return;
      }
      showMessage(estado === 'DONE' ? 'Orden marcada como completada' : 'Orden anulada correctamente');
      fetchAppointments();
    } catch {
      showMessage('Error al comunicar con el servidor', 'error');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>BookIt</h1>
        <p>Expert Appointment Reservation Management</p>
        <nav>
          <button 
            className={activePage === 'reservations' ? 'active' : ''} 
            onClick={() => setActivePage('reservations')}
          >
            Reservaciones
          </button>
          <button 
            className={activePage === 'orders' ? 'active' : ''} 
            onClick={() => setActivePage('orders')}
          >
            Mis Órdenes
          </button>
        </nav>
      </header>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <main>
        {activePage === 'reservations' ? (
          <ReservationsPage 
            services={services}
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            showMessage={showMessage}
          />
        ) : (
          <OrdersPage 
            appointments={appointments}
            filter={filter}
            setFilter={setFilter}
            updateStatus={updateStatus}
          />
        )}
      </main>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #eeeeee', paddingTop: '20px', color: '#999', fontSize: '0.8rem' }}>
        <p>&copy; 2012 BookIt Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
