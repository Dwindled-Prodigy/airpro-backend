package com.airpro.repository;

import com.airpro.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByFlightScheduleId(Long flightScheduleId);

    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.user u " +
           "JOIN FETCH b.flightSchedule fs " +
           "JOIN FETCH fs.flight f " +
           "JOIN FETCH f.carrier c " +
           "JOIN FETCH b.seatCategory sc " +
           "WHERE b.user.id = :userId")
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);
}
