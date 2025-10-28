package iceapple.placeservice.repository.jdbc;

import iceapple.placeservice.entity.Place;
import iceapple.placeservice.repository.PlaceRepository;
import iceapple.placeservice.util.TimeCount;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.transaction.annotation.Transactional;

public class JdbcPlaceRepository implements PlaceRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcPlaceRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public List<Place> findAll() {
        String sql = "SELECT * FROM place";
        List<Place> places = jdbcTemplate.query(sql, rowMapper());
        return places;
    }

    @Override
    public List<TimeCount> findTimeCount(String placeId, LocalDate date) {
        String sql = "SELECT time, count FROM time_count WHERE place_id = ? AND date = ?";
        return jdbcTemplate.query(sql, new Object[]{placeId, date},
                (rs, rowNum) -> new TimeCount(rs.getInt("time"), rs.getInt("count")));
    }


    public String findPlaceNameById(String placeId) {
        String sql = "SELECT name FROM place WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{placeId}, String.class);
    }

    public Integer findPlaceCountById(String placeId) {
        String sql = "SELECT place_count FROM place WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, placeId);
    }

    @Transactional
    @Override
    public void increaseTimeCount(final String placeId, final LocalDate date, final List<Integer> times, Integer resCount) {

        jdbcTemplate.queryForObject("SELECT place_count FROM place WHERE id = ? FOR UPDATE",
                Integer.class, placeId);

        // 존재 보장
        final String ensureSql =
                "INSERT INTO time_count(place_id, date, time, count) " +
                        "VALUES (?, ?, ?, 0) ON CONFLICT (place_id, date, time) DO NOTHING";

        // 정원 미만일 때만 +1
        final String incSql =
                "UPDATE time_count " +
                        "SET count = count + ? " +
                        "WHERE place_id = ? AND date = ? AND time = ? " +
                        "  AND count + ?  <= (SELECT place_count FROM place WHERE id = ?)";

        Date d = Date.valueOf(date);

        for (Integer t : times) {
            jdbcTemplate.update(ensureSql, placeId, d, t);
            int affected = jdbcTemplate.update(incSql, resCount, placeId, d, t, resCount, placeId);
            if (affected == 0) {
                throw new IllegalStateException("정원 초과");
            }
        }
    }

    @Override
    public void decreaseTimeCount(final String placeId, final LocalDate date, final List<Integer> times, Integer resCount) {
        final String sql =
                "UPDATE time_count SET count = GREATEST(count - ?, 0) " +
                        "WHERE place_id = ? AND date = ? AND time = ?";

        jdbcTemplate.batchUpdate(sql, times, times.size(), (ps, t) -> {
            ps.setInt(1, resCount);
            ps.setString(2, placeId);
            ps.setDate(3, java.sql.Date.valueOf(date));
            ps.setInt(4, t);
        });
    }


    private RowMapper<Place> rowMapper() {
        return (rs, rowNum) -> new Place(
                rs.getString("id"),
                rs.getString("name"),
                rs.getString("description")
        );
    }

    @Override
    public Optional<Place> findById(String id) {
        String sql = "SELECT id, name, description FROM place WHERE id = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, rowMapper())
                .stream().findFirst();
    }

    @Override
    public boolean existsById(String id) {
        String sql = "SELECT COUNT(1) FROM place WHERE id = ?";
        Integer cnt = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return cnt != null && cnt > 0;
    }

    @Override
    public void insert(Place place, Integer placeCount) {
        if (placeCount != null) {
            String sql = "INSERT INTO place (id, name, description, place_count) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(sql, place.getId(), place.getName(), place.getDescription(), placeCount);
        } else {
            String sql = "INSERT INTO place (id, name, description) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, place.getId(), place.getName(), place.getDescription());
        }
    }

    @Override
    public void deleteById(String id) {
        String sql = "DELETE FROM place WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

}
