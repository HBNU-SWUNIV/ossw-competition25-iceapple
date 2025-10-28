package iceapple.placeservice.repository.jdbc;

import iceapple.placeservice.dto.ReservationSlot;
import iceapple.placeservice.dto.request.AdminReservationRequest;
import iceapple.placeservice.entity.Reservation;
import iceapple.placeservice.dto.request.ReservationRequest;
import iceapple.placeservice.repository.ReservationRepository;
import java.sql.Array;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.sql.DataSource;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;


public class JdbcReservationRepository implements ReservationRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcReservationRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public ResponseEntity<Void> createReservation(final ReservationRequest request) {
        String sql = "INSERT INTO reservation (id, student_number, phone_number, password, place_id, date, times, res_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        String id = String.format("r_%s", UUID.randomUUID());

        jdbcTemplate.update(connection -> {
            PreparedStatement psmt = connection.prepareStatement(sql, new String[]{"id"});
            psmt.setString(1, id.toString());
            psmt.setString(2, request.studentNumber());
            psmt.setString(3, request.phoneNumber());
            psmt.setString(4, request.password());
            psmt.setString(5, request.placeId());
            psmt.setTimestamp(6, Timestamp.valueOf(request.date()));
            psmt.setObject(7, request.times().toArray(new Integer[0]));
            psmt.setInt(8, request.resCount());
            return psmt;
        });

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> updateReservationInfo(final String reservationId,
                                                      final AdminReservationRequest request) {

        String sql = " UPDATE reservation SET date = ?,times = ? WHERE id = ?";

        int updated = jdbcTemplate.update(connection -> {
            var ps = connection.prepareStatement(sql);

            Integer[] times = request.times().toArray(new Integer[0]);
            Array sqlArray = connection.createArrayOf("integer", times);

            ps.setDate(1, Date.valueOf(request.date()));
            ps.setArray(2, sqlArray);
            ps.setString(3, reservationId);
            return ps;
        });

        if (updated == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

//    @Override
//    public List<Reservation> searchReservationInfo(final String studentNumber, final String password) {
//        String sql = "SELECT id, times, date, room_id FROM reservation WHERE student_number = ? AND password = ?";

    /// / /        return jdbcTemplate.query(sql, new Object[]{studentNumber, password}, /                (rs, rowNum)
    /// -> new ReservationRoomResponse(rs.getString("id"), rs.getArray("times"),
    /// rs.getTimestamp("date").toLocalDateTime().toLocalDate()));
//        List<Reservation> reservations = new ArrayList<>();
//        return reservations;
//    };
    @Override
    public List<Reservation> searchReservationInfo(final String studentNumber, final String password) {
        String sql = "SELECT * FROM reservation WHERE student_number = ? AND password = ?";

        return jdbcTemplate.query(sql, new Object[]{studentNumber, password}, (rs, rowNum) -> {
            String id = rs.getString("id");
            String phoneNumber = rs.getString("phone_number");
            Array sqlArray = rs.getArray("times");
            Integer[] timesArray = (Integer[]) sqlArray.getArray();
            List<Integer> times = Arrays.asList(timesArray);

            LocalDateTime date = rs.getTimestamp("date").toLocalDateTime();
            String placeId = rs.getString("place_id");
            int resCount = rs.getInt("res_count");

            return new Reservation(id, studentNumber, phoneNumber, password, placeId, date, times, resCount);
        });
    }

    @Override
    public int cancelReservations(final List<String> ids) {
        String sql = "DELETE FROM reservation WHERE id = ?";
        return ids.stream()
                .mapToInt(id -> jdbcTemplate.update(sql, id))
                .sum();
    }

    @Override
    public String findNamePlace(final String placeId) {
        String sql = "SELECT name FROM place WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{placeId}, String.class);
    }

    @Override
    public List<Reservation> findByStudentNumber(final String studentNumber) {
        String sql = "SELECT * FROM reservation WHERE student_number = ?";

        return jdbcTemplate.query(sql, new Object[]{studentNumber}, rowMapper());

    }

    @Override
    public List<Reservation> findByReservationDate(final LocalDate date) {
        String sql = "SELECT * FROM reservation WHERE date = ?";

        return jdbcTemplate.query(sql, new Object[]{date}, rowMapper());
    }

    @Override
    public Reservation findByReservationId(final String reservationId) {
        String sql = "SELECT * FROM reservation WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, rowMapper(), reservationId);
    }


    @Override
    public List<ReservationSlot> deleteAndReturnSlots(final List<String> ids) {
        String sql = "DELETE FROM reservation WHERE id = ANY (?) RETURNING place_id, date, times, res_count";

        return jdbcTemplate.query(
                con -> {
                    PreparedStatement ps = con.prepareStatement(sql);
                    ps.setArray(1, con.createArrayOf("text", ids.toArray()));
                    return ps;
                },
                (rs) -> {
                    List<ReservationSlot> result = new ArrayList<>();
                    while (rs.next()) {
                        String placeId = rs.getString("place_id");
                        LocalDate date = rs.getTimestamp("date").toLocalDateTime().toLocalDate();
                        Integer[] timesArr = (Integer[]) rs.getArray("times").getArray();
                        Integer resCount = rs.getInt("res_count");

                        result.add(new ReservationSlot(placeId, date, Arrays.asList(timesArr), resCount));
                    }
                    return result;
                }
        );
    }

    private RowMapper<Reservation> rowMapper() {

        return (rs, rowNum) -> {
            Array sqlArray = rs.getArray("times");
            Integer[] timesArray = (Integer[]) sqlArray.getArray();
            List<Integer> times = Arrays.asList(timesArray);

            LocalDateTime dateTime = rs.getTimestamp("date").toLocalDateTime();

            return new Reservation(
                    rs.getString("id"),
                    rs.getString("student_number"),
                    rs.getString("phone_number"),
                    rs.getString("password"),
                    rs.getString("place_id"),
                    dateTime,
                    times,
                    rs.getInt("res_count")
            );
        };
    }
}
