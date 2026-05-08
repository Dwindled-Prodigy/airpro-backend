package com.airpro.service;

import com.airpro.dto.ApiResponse;
import com.airpro.dto.user.FlightSearchResponse;
import com.airpro.entity.FlightSchedule;
import com.airpro.entity.FlightSeatInventory;
import com.airpro.repository.FlightScheduleRepository;
import com.airpro.repository.FlightSeatInventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FlightSearchService {

    private final FlightScheduleRepository scheduleRepo;
    private final FlightSeatInventoryRepository inventoryRepo;

    public FlightSearchService(FlightScheduleRepository scheduleRepo, FlightSeatInventoryRepository inventoryRepo) {
        this.scheduleRepo = scheduleRepo;
        this.inventoryRepo = inventoryRepo;
    }

    public ApiResponse<List<FlightSearchResponse>> searchFlights(String origin, String destination, LocalDate travelDate) {
        List<FlightSchedule> schedules = scheduleRepo.findByFlightOriginAndFlightDestinationAndTravelDate(origin, destination, travelDate);

        List<FlightSearchResponse> responseList = schedules.stream().map(schedule -> {
            FlightSearchResponse response = new FlightSearchResponse();
            response.setFlightScheduleId(schedule.getId());
            response.setFlightNumber(schedule.getFlight().getFlightNumber());
            response.setCarrierName(schedule.getFlight().getCarrier().getName());
            response.setOrigin(schedule.getFlight().getOrigin());
            response.setDestination(schedule.getFlight().getDestination());
            response.setTravelDate(schedule.getTravelDate());
            response.setDepartureTime(schedule.getDepartureTime());
            response.setArrivalTime(schedule.getArrivalTime());

            List<FlightSeatInventory> inventories = inventoryRepo.findByFlightScheduleId(schedule.getId());

            List<FlightSearchResponse.SeatCategoryDto> seatDtos = inventories.stream().map(inv -> {
                FlightSearchResponse.SeatCategoryDto seatDto = new FlightSearchResponse.SeatCategoryDto();
                seatDto.setSeatCategoryId(inv.getSeatCategory().getId());
                seatDto.setCategoryName(inv.getSeatCategory().getName().name());
                seatDto.setTotalSeats(inv.getTotalSeats());
                seatDto.setAvailableSeats(inv.getAvailableSeats());
                seatDto.setPrice(inv.getPrice());
                return seatDto;
            }).collect(Collectors.toList());

            response.setSeatCategories(seatDtos);
            return response;
        }).collect(Collectors.toList());

        return ApiResponse.success(responseList, "Flights fetched successfully");
    }
}
