package com.bookit.config;

import com.bookit.model.Service;
import com.bookit.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initServices(ServiceRepository serviceRepository) {
        return args -> {
            if (serviceRepository.count() == 0) {
                serviceRepository.save(new Service("Corte de cabello", "Servicio de corte de cabello profesional", 30));
                serviceRepository.save(new Service("Asesoría académica", "Sesión de asesoría académica personalizada", 60));
                serviceRepository.save(new Service("Consulta técnica", "Consulta técnica especializada en tecnología", 45));
                serviceRepository.save(new Service("Tutoría", "Sesión de tutoría individual o grupal", 90));
            }
        };
    }
}
