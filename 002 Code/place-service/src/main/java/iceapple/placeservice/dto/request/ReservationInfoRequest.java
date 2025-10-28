package iceapple.placeservice.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ReservationInfoRequest(
        @JsonProperty("student_number")
        String studentNumber,

        String password
) {
}

