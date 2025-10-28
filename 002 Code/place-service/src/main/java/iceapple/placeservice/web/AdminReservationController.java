package iceapple.placeservice.web;

import iceapple.placeservice.dto.request.AdminReservationRequest;
import iceapple.placeservice.dto.response.AdminReservationResponse;
import iceapple.placeservice.service.ReservationService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/reservations")
public class AdminReservationController {

    private final ReservationService reservationService;

    @GetMapping()
    public ResponseEntity<Map<String, List<AdminReservationResponse>>> getAllReservations(
            @RequestParam("date") LocalDate date) {
        try {
            List<AdminReservationResponse> reservations = reservationService.getReservationsByDateForAdmin(date);
            return ResponseEntity.ok(Map.of("reservations", reservations));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Void> createReservation(@RequestBody final AdminReservationRequest request) {
        try {
            return reservationService.adminCreateReservation(request);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PatchMapping("/{reservation_id}")
    public ResponseEntity<Void> updateReservation(@PathVariable("reservation_id") String reservationId,
                                                  @RequestBody final AdminReservationRequest request) {
        try {
            reservationService.updateAdminReservation(reservationId, request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("/{reservation_id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable("reservation_id") String reservationId) {
        try {
            reservationService.cancelReservations(List.of(reservationId));
            return ResponseEntity.ok().build();
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
