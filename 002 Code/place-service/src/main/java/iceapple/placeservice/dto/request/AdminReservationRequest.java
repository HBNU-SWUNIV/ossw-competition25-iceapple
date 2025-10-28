package iceapple.placeservice.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.util.List;

public record AdminReservationRequest(
        LocalDate date,

        @JsonProperty("place_id")
        String placeId,

        List<Integer> times,

        @JsonProperty("user_name")
        String userName,

        @JsonProperty("res_count")
        int resCount
) {
}