package iceapple.placeservice.web;

import iceapple.placeservice.dto.response.ReservationPlaceResponse;
import iceapple.placeservice.dto.request.ReservationInfoRequest;
import iceapple.placeservice.dto.request.ReservationRequest;
import iceapple.placeservice.repository.ReservationRepository;
import iceapple.placeservice.service.ReservationService;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;

    @PostMapping("/reservation-info")
    public ResponseEntity<?> reservationInfo(@RequestBody final ReservationInfoRequest request) {
        if (request.studentNumber() == null || request.studentNumber().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("학번은 필수입니다.");
        }
        if (request.password() == null || request.password().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호는 필수입니다.");
        }

        List<ReservationPlaceResponse> response = reservationService.searchReservationInfo(
                request.studentNumber(),
                request.password());


        return ResponseEntity.ok(response);
    }


    @PostMapping()
    public ResponseEntity<Void> createReservation(@RequestBody final ReservationRequest request) {
        try {
            return reservationService.createReservation(request);
        } catch (IllegalStateException e) {
            System.out.println("createReservation" + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }


    @DeleteMapping()
    public ResponseEntity<Void> cancelReservations(@RequestBody final Map<String, List<String>> request) {
        try {
            List<String> ids = request.get("reservation_id");
            return reservationService.cancelReservations(ids);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
