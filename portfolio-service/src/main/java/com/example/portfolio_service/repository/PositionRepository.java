package com.example.portfolio_service.repository;


import com.example.portfolio_service.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByPortfolioId(Long portfolioId);
    Optional<Position> findByPortfolioIdAndSymbol(Long portfolioId, String symbol);
    Optional<Position> getByOrderId(String orderId);
}
