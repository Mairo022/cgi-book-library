package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.repository.CheckOutRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Join;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Service
public class CheckOutService {

    @Autowired
    private CheckOutRepository checkOutRepository;

    public Page<CheckOutDTO> getCheckOuts(String title, String author, String year, String borrowerFirstName, String borrowerLastName, boolean late, Pageable pageable) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        Specification<CheckOut> spec = Specification.where(null);

        if (title != null) {
            spec = spec.and((checkOut, cq, cb) -> {
                Join<CheckOut, Book> book = checkOut.join("borrowedBook");
                return cb.like(cb.lower(book.get("title")), "%" + title.toLowerCase() + "%");
            });
        }
        if (author != null) {
            spec = spec.and((checkOut, cq, cb) -> {
                Join<CheckOut, Book> book = checkOut.join("borrowedBook");
                return cb.like(cb.lower(book.get("author")), "%" + author.toLowerCase() + "%");
            });
        }
        if (year != null) {
            spec = spec.and((checkOut, cq, cb) -> {
                Join<CheckOut, Book> book = checkOut.join("borrowedBook");
                return cb.equal(book.get("year"), year);
            });
        }
        if (borrowerFirstName != null) {
            spec = spec.and((checkOut, cq, cb) -> cb.like(cb.lower(checkOut.get("borrowerFirstName")), "%" + borrowerFirstName.toLowerCase() + "%"));
        }
        if (borrowerLastName != null) {
            spec = spec.and((checkOut, cq, cb) -> cb.like(cb.lower(checkOut.get("borrowerLastName")), "%" + borrowerLastName.toLowerCase() + "%"));
        }
        if (late == true) {
            LocalDate today = LocalDate.now();

            spec = spec.and((checkOut, cq, cb) -> cb.and(
                    cb.lessThan(checkOut.get("dueDate"), today),
                    cb.isNull(checkOut.get("returnedDate"))
            ));
        }

        return checkOutRepository.findAll(spec, pageable).map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
    }

    public CheckOutDTO getCheckOut(UUID checkOutId) {
        CheckOut checkOut = checkOutRepository.getOne(checkOutId);
        return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
    }

    public void saveCheckOut(CheckOutDTO checkOutDTO) {
        checkOutRepository.save(ModelMapperFactory.getMapper().map(checkOutDTO, CheckOut.class));
    }

    public void deleteCheckOut(UUID checkOutId) {
        checkOutRepository.deleteById(checkOutId);
    }
}
