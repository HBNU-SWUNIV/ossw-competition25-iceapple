package iceapple.placeservice.dto.response;

import iceapple.placeservice.entity.Place;
import java.util.List;

public record PlaceListResponse(
         List<Place> places
) {
}
