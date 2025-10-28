package iceapple.placeservice.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import iceapple.placeservice.entity.Place;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationPlaceResponse(String id, List<Integer> times, LocalDateTime date, Place place,
                                       @JsonProperty("res_count") int resCount) {
}