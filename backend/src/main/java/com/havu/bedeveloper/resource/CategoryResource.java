package com.havu.bedeveloper.resource;

import com.havu.bedeveloper.entity.Category;
import com.havu.bedeveloper.exception.domain.CategoryNameExistException;
import com.havu.bedeveloper.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryResource {

    private final CategoryService service;

    // 1
    @GetMapping("/get-all")
    public ResponseEntity<List<Category>> getAll() {
        return new ResponseEntity<>(this.service.getAllStatusTrue(), OK);
    }

    // 2
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Category> getById(@PathVariable("id") int id) {
        return new ResponseEntity<>(this.service.getById(id), OK);
    }

    // 3 *
    @PostMapping("/add")
    public ResponseEntity<Category> addNewCategory(@RequestBody Category category)
           throws CategoryNameExistException {
        return new ResponseEntity<>(this.service.save(category.getId(), category), CREATED);
    }

    // 4 *
    @PutMapping("/update")
    public ResponseEntity<Category> update(@RequestBody Category category)
           throws CategoryNameExistException {
        return new ResponseEntity<>(this.service.save(category.getId(), category), OK);

    }

    // 5 *
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") int id) throws Exception {
        this.service.deleteCategoryById(id);
        return new ResponseEntity<>(OK);
    }
}
