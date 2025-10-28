package iceapple.placeservice.repository;

import iceapple.placeservice.dto.ReservationSlot;
import iceapple.placeservice.dto.request.AdminReservationRequest;
import iceapple.placeservice.dto.request.ReservationRequest;
import iceapple.placeservice.entity.Reservation;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface ReservationRepository {

    List<Reservation> searchReservationInfo(String studentNumber, String password);

    ResponseEntity<Void> createReservation(ReservationRequest request);

    ResponseEntity<Void> updateReservationInfo(String reservationId, AdminReservationRequest request);

    int cancelReservations(List<String> ids);

    String findNamePlace(String placeId);

    List<Reservation> findByStudentNumber(String studentNumber);

    List<Reservation> findByReservationDate(LocalDate date);

    Reservation findByReservationId(String reservationId);

    List<ReservationSlot> deleteAndReturnSlots(List<String> ids);

}
