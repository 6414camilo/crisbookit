package com.bookit.repository;

import com.bookit.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByEstadoOrderByFechaDescHoraDesc(String estado);
    List<Appointment> findAllByOrderByFechaDescHoraDesc();
}
