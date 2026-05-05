package com.airpro.repository;

import com.airpro.entity.FlightSeatInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightSeatInventoryRepository extends JpaRepository<FlightSeatInventory, Long> {
    List<FlightSeatInventory> findByFlightScheduleId(Long flightScheduleId);
    Optional<FlightSeatInventory> findByFlightScheduleIdAndSeatCategoryId(Long flightScheduleId, Long seatCategoryId);
}
