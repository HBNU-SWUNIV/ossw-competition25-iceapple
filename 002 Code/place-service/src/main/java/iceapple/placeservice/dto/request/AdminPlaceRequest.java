package iceapple.placeservice.dto.request;

public record AdminPlaceRequest(
        String name,

        String description,

        Integer placeCount
) {
}