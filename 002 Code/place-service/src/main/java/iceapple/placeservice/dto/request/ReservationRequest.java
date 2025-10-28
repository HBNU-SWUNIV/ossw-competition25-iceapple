package iceapple.placeservice.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationRequest(
        @JsonProperty("student_number")
        String studentNumber,

        @JsonProperty("phone_number")
        String phoneNumber,

        String password,

        @JsonProperty("place_id")
        String placeId,

        LocalDateTime date,

        List<Integer> times,

        @JsonProperty("res_count")
        int resCount
) {
}
