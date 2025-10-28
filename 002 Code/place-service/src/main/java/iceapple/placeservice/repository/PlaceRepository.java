package iceapple.placeservice.repository;

import iceapple.placeservice.entity.Place;
import iceapple.placeservice.util.TimeCount;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PlaceRepository {
    List<Place> findAll();
    List<TimeCount> findTimeCount(String id, LocalDate date);
    String findPlaceNameById(String id);
    Integer findPlaceCountById(String id);
    void increaseTimeCount(String placeId, LocalDate date, List<Integer> times, Integer resCount);
    void decreaseTimeCount(String placeId, LocalDate date, List<Integer> times, Integer resCount); // (취소 시)

    // 관리자용 쓰기/조회 보조
    void insert(Place place, Integer placeCount);
    void deleteById(String id);
    boolean existsById(String id);
    Optional<Place> findById(String id);
}
