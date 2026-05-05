package com.airpro.repository;

import com.airpro.entity.SeatCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatCategoryRepository extends JpaRepository<SeatCategory, Long> {
    Optional<SeatCategory> findByName(SeatCategory.Name name);
}
