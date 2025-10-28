package iceapple.placeservice.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * reservation cancel 시 ids 값만 받아오는데
 * count 값 감소시 아래 추가 정보 필요
 * @param placeId
 * @param date
 * @param times
 */
public record ReservationSlot(
    String placeId,
    LocalDate date,
    List<Integer> times,
    Integer resCount
) {}