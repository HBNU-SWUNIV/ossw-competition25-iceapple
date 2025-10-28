package iceapple.placeservice.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record AdminReservationResponse(
        String id,
        List<Integer> times,

        @JsonProperty("student_number")
        String studentNumber,

        @JsonProperty("phone_number")
        String phoneNumber,

        PlaceInfo place,

        @JsonProperty("res_count")
        int resCount
) {
    public record PlaceInfo(
            String id,

            String name,

            int count
    ) {}
}