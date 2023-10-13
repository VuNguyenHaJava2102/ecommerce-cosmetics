package com.havu.bedeveloper.service;

import com.havu.bedeveloper.entity.Category;
import com.havu.bedeveloper.exception.domain.CategoryNameExistException;
import com.havu.bedeveloper.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;

    // public functions
    // 1
    public List<Category> getAllStatusTrue() {
        return this.repository.findAllByStatusTrue();
    }

    // 2
    public void deleteCategoryById(int id) throws Exception {
        try {
            // in case we remove category that has constraint in other products, throw exception
            this.repository.deleteById(id);
        } catch(Exception e) {
            throw new Exception();
        }
    }

    // 3
    public Category save(int id, Category category)
           throws CategoryNameExistException {
        checkNameExistence(id, category.getName());
        return this.repository.save(category);
    }

    // 4
    public Category getById(int id) {
        return this.repository.findById(id).get();
    }

    // private functions
    private void checkNameExistence(int id, String name)
           throws CategoryNameExistException {
        Category categoryByName = this.repository.findByName(name);
        if(id != 0) { // case: update
            if(categoryByName != null && categoryByName.getId() != id) {
                throw new CategoryNameExistException("Loại sản phẩm với tên : " + name + " đã tồn tại.");
            }
        } else { // case: add
            if(categoryByName != null) {
                throw new CategoryNameExistException("Loại sản phẩm với tên : " + name + " đã tồn tại.");
            }
        }
    }
}
