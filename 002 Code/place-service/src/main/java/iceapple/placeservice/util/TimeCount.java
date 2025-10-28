package iceapple.placeservice.util;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeCount {
    private int time;
    private int count;

    public TimeCount(final int time, final int count) {
        this.time = time;
        this.count = count;
    }
}
