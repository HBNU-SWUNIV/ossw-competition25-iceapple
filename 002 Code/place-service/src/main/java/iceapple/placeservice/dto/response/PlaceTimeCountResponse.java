package iceapple.placeservice.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PlaceTimeCountResponse(
        String name,
        int[] count,

        @JsonProperty("max_count")
        int maxCount
) {
}



