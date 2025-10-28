package iceapple.placeservice.dto.response;

public record AdminPlaceResponse(
        String id,

        String name,

        String description,

        int count
) {
}