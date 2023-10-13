package com.havu.bedeveloper;

import com.havu.bedeveloper.domain.response.Statistics;
import com.havu.bedeveloper.repository.StatisticsRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class RepositoryTest {

    @Autowired
    private StatisticsRepository repository;

    @Test
    public void test() {
        List<Integer> years = this.repository.getAllYears();
        years.forEach(System.out::println);
    }
}
