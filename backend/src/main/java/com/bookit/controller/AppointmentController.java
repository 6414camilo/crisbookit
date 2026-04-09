package com.bookit.controller;

import com.bookit.model.Appointment;
import com.bookit.model.Service;
import com.bookit.repository.AppointmentRepository;
import com.bookit.repository.ServiceRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentController(AppointmentRepository appointmentRepository, ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.serviceRepository = serviceRepository;
    }

    @GetMapping("/appointments")
    public List<Appointment> getAppointments(@RequestParam(required = false) String estado) {
        if (estado != null && !estado.isEmpty()) {
            return appointmentRepository.findByEstadoOrderByFechaDescHoraDesc(estado);
        }
        return appointmentRepository.findAllByOrderByFechaDescHoraDesc();
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        Optional<Service> servicio = serviceRepository.findById(request.servicioId());
        if (servicio.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El servicio asociado no existe"));
        }

        Appointment appointment = new Appointment();
        appointment.setNombreCliente(request.nombreCliente());
        appointment.setCorreoCliente(request.correoCliente());
        appointment.setFecha(request.fecha());
        appointment.setHora(request.hora());
        appointment.setEstado("PENDING");
        appointment.setServicio(servicio.get());

        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentRepository.save(appointment));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String estado = body.get("estado");

        if (estado == null || (!estado.equals("DONE") && !estado.equals("CANCELLED"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Estado inválido. Use DONE o CANCELLED"));
        }

        Optional<Appointment> opt = appointmentRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Cita no encontrada"));
        }

        Appointment appointment = opt.get();

        if (appointment.getEstado().equals("CANCELLED") && estado.equals("DONE")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Una cita cancelada no puede marcarse como atendida"));
        }

        if (appointment.getEstado().equals("DONE") && estado.equals("CANCELLED")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Una cita atendida no puede cancelarse"));
        }

        appointment.setEstado(estado);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Optional<Appointment> opt = appointmentRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Cita no encontrada"));
        }

        appointmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Cita eliminada correctamente"));
    }

    public record AppointmentRequest(
            String nombreCliente,
            String correoCliente,
            java.time.LocalDate fecha,
            java.time.LocalTime hora,
            Long servicioId
    ) {}
}
