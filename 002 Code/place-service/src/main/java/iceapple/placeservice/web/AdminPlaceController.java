package iceapple.placeservice.web;

import iceapple.placeservice.dto.request.AdminPlaceRequest;
import iceapple.placeservice.dto.response.AdminPlaceResponse;
import iceapple.placeservice.entity.Place;
import iceapple.placeservice.service.PlaceService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/places")
public class AdminPlaceController {

    private final PlaceService placeService;

    @GetMapping
    public ResponseEntity<Map<String, List<AdminPlaceResponse>>> getAllPlaces() {
        try {
            List<AdminPlaceResponse> places = placeService.findPlaces().stream()
                    .map(p -> {
                        int count = placeService.findPlaceCountById(p.getId());
                        return new AdminPlaceResponse(p.getId(), p.getName(), p.getDescription(), count);
                    })
                    .toList();
            return ResponseEntity.ok(Map.of("places", places));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }


@PostMapping
public ResponseEntity<Map<String, String>> createPlace(@RequestBody final AdminPlaceRequest request) {
    try {
        Place saved = placeService.createPlace(
                request.name(),
                request.description(),
                request.placeCount()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("place_id", saved.getId())); // place_id 반환

    } catch (RuntimeException e) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
}

    @DeleteMapping("/{place_id}")
    public ResponseEntity<Void> deletePlace(@PathVariable("place_id") String placeId) {
        try {
            placeService.deletePlace(placeId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}