package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.domain.response.Statistics;
import com.havu.bedeveloper.entity.Product;
import com.havu.bedeveloper.service.ProductService;
import com.havu.bedeveloper.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/statistic")
@RequiredArgsConstructor
public class StatisticsResource {

    private final ProductService productService;
    private final StatisticsService statisticsService;

    //
    @GetMapping("/get-inventory")
    public ResponseEntity<List<Product>> getProductsByQuantityDesc() {
        List<Product> products = this.productService.getProductsByQuantityDesc();
        return new ResponseEntity<>(products, OK);
    }

    //
    @GetMapping("/revenue-current-year")
    public ResponseEntity<Double> getRevenueOfCurrentYear() {
        double revenue = this.statisticsService.getRevenueOfCurrentYear();
        return new ResponseEntity<>(revenue, OK);
    }

    //
    @GetMapping("/revenue-current-month")
    public ResponseEntity<Double> getRevenueOfCurrentMonth() {
        double revenue = this.statisticsService.getRevenueOfCurrentMonth();
        return new ResponseEntity<>(revenue, OK);
    }

    @GetMapping("/all-years")
    public ResponseEntity<List<Integer>> getAllYears() {
        List<Integer> years = this.statisticsService.getAllYears();
        return new ResponseEntity<>(years, OK);
    }

    //
    @GetMapping("/revenue-by-month/{year}")
    public ResponseEntity<List<Statistics>> getRevenueOfMonthsByYear(@PathVariable("year") int year) {
        List<Statistics> objects = this.statisticsService.getRevenueOfMonthsByYear(year);
        return new ResponseEntity<>(objects, OK);
    }
}
