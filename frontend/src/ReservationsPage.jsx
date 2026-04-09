import React from 'react';

function ReservationsPage({ services, form, setForm, handleSubmit, showMessage }) {
  return (
    <div className="reservations-page">
      <div className="section">
        <h2>Servicios Disponibles</h2>
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <h3>{s.nombre}</h3>
              <p>{s.descripcion}</p>
              <p className="duration">{s.duracionMinutos} min</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Registrar Nueva Cita</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del cliente</label>
              <input
                type="text"
                value={form.nombreCliente}
                onChange={(e) => setForm({ ...form, nombreCliente: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Correo del cliente</label>
              <input
                type="email"
                value={form.correoCliente}
                onChange={(e) => setForm({ ...form, correoCliente: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Servicio</label>
              <select
                value={form.servicioId}
                onChange={(e) => setForm({ ...form, servicioId: e.target.value })}
                required
              >
                <option value="">Seleccione un servicio</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} ({s.duracionMinutos} min)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="btn">
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationsPage;
