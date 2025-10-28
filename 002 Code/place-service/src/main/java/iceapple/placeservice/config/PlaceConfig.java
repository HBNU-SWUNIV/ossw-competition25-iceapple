package iceapple.placeservice.config;

import iceapple.placeservice.repository.ReservationRepository;
import iceapple.placeservice.repository.jdbc.JdbcReservationRepository;
import iceapple.placeservice.repository.jdbc.JdbcPlaceRepository;
import iceapple.placeservice.repository.PlaceRepository;
import iceapple.placeservice.service.ReservationService;
import iceapple.placeservice.service.PlaceService;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PlaceConfig {
    private final DataSource dataSource;

    public PlaceConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public PlaceRepository placeRepository() {
        return new JdbcPlaceRepository(dataSource);
    }

    @Bean
    public PlaceService placeServiceService() {
        return new PlaceService(placeRepository());
    }

    @Bean
    public ReservationRepository reservationRepository() {
        return new JdbcReservationRepository(dataSource);
    }

    @Bean
    public ReservationService reservationService(PasswordEncoder passwordEncoder) {
        return new ReservationService(reservationRepository(),placeRepository(), passwordEncoder);
    }
}
