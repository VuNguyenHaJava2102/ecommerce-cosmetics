package com.havu.bedeveloper.service;

import com.havu.bedeveloper.domain.response.Statistics;
import com.havu.bedeveloper.repository.StatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StatisticsRepository statisticsRepo;

    //
    public double getRevenueOfCurrentYear() {
        return this.statisticsRepo.getRevenueOfCurrentYear();
    }

    //
    public double getRevenueOfCurrentMonth() {
        return this.statisticsRepo.getRevenueOfCurrentMonth();
    }

    //
    public List<Integer> getAllYears() {
        return this.statisticsRepo.getAllYears();
    }

    //
    public List<Statistics> getRevenueOfMonthsByYear(int year) {
        return this.statisticsRepo.getRevenueOfMonthsByYear(year);
    }
}
