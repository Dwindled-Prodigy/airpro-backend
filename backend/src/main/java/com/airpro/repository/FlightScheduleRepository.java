package com.airpro.repository;

import com.airpro.entity.FlightSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {
    List<FlightSchedule> findByFlightOriginAndFlightDestinationAndTravelDate(String origin, String destination, LocalDate travelDate);
    List<FlightSchedule> findByFlightId(Long flightId);
}
