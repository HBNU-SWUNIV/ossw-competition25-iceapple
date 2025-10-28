package iceapple.placeservice.web;

import iceapple.placeservice.dto.response.PlaceListResponse;
import iceapple.placeservice.dto.response.PlaceTimeCountResponse;
import iceapple.placeservice.entity.Place;
import iceapple.placeservice.service.PlaceService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/places")
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    public ResponseEntity<PlaceListResponse> getPlaces() {
        List<Place> places = placeService.findPlaces();

        return ResponseEntity.ok(new PlaceListResponse(places));
    }

    @GetMapping("/{place_id}")
    public ResponseEntity<PlaceTimeCountResponse> getPlace(@PathVariable("place_id") String placeId,
                                                           @RequestParam LocalDate date) {

        return ResponseEntity.ok(placeService.findByPlaceId(placeId, date));
    }
}