package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.repository.BookRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Page<BookDTO> getBooks(String title, String author, String genre, String year, String status, Pageable pageable) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        Specification<Book> spec = Specification.where(null);

        if (title != null) {
            spec = spec.and((book, cq, cb) -> cb.like(cb.lower(book.get("title")), "%" + title.toLowerCase() + "%"));
        }
        if (author != null) {
            spec = spec.and((book, cq, cb) -> cb.like(cb.lower(book.get("author")), "%" + author.toLowerCase() + "%"));
        }
        if (genre != null) {
            spec = spec.and((book, cq, cb) -> cb.like(cb.lower(book.get("genre")), "%" + genre.toLowerCase() + "%"));
        }
        if (year != null) {
            spec = spec.and((book, cq, cb) -> cb.equal(book.get("year"), year));
        }
        if (status != null) {
            spec = spec.and((book, cq, cb) -> cb.equal(book.get("status"), BookStatus.valueOf(status)));
        }

        return bookRepository.findAll(spec, pageable).map(book -> modelMapper.map(book, BookDTO.class));
    }

    public BookDTO getBook(UUID bookId) {
        Book book = bookRepository.getOne(bookId);
        return ModelMapperFactory.getMapper().map(book, BookDTO.class);
    }

    public UUID saveBook(BookDTO bookDTO) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.save(modelMapper.map(bookDTO, Book.class)).getId();
    }

    public void deleteBook(UUID bookId) {
        bookRepository.deleteById(bookId);
    }
}
