package iceapple.placeservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class Reservation {
    private final String id;
    private final String studentNumber;
    private final String phoneNumber;
    private final String password;
    private final String placeId;
    private final LocalDateTime date;
    private final List<Integer> times;

    @JsonProperty("res_count")
    private final int resCount;
}
