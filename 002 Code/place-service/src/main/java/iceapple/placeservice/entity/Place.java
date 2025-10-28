package iceapple.placeservice.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class Place {
    private String id;
    private String name;
    private String description;

    public Place() {
    }

    public Place(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Place(final String id, final String name, final String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

}
