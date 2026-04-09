import React from 'react';

function OrdersPage({ appointments, filter, setFilter, updateStatus }) {
  return (
    <div className="orders-page">
      <div className="section">
        <h2>Listado de Órdenes</h2>
        <div className="filters">
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'PENDING', label: 'Pendientes' },
            { id: 'DONE', label: 'Atendidas' },
            { id: 'CANCELLED', label: 'Canceladas' }
          ].map((f) => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="appointments-list">
          {appointments.length === 0 ? (
            <div className="empty-state">No se encontraron órdenes registradas.</div>
          ) : (
            appointments.map((a) => (
              <div key={a.id} className="appointment-card">
                <div className="appointment-info">
                  <h4>{a.nombreCliente}</h4>
                  <p>
                    {a.servicio?.nombre || 'Servicio no especificado'} | {a.fecha} a las {a.hora?.substring(0, 5)}
                  </p>
                  <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>{a.correoCliente}</p>
                </div>
                <div className="appointment-actions">
                  <span className={`status-badge status-${a.estado}`}>{a.estado}</span>
                  {a.estado === 'PENDING' && (
                    <>
                      <button className="btn btn-done" onClick={() => updateStatus(a.id, 'DONE')}>
                        Completar
                      </button>
                      <button className="btn btn-cancel" onClick={() => updateStatus(a.id, 'CANCELLED')}>
                        Anular
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
