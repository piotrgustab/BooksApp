{
    'use strict';
  
    const select = {
      templateOf: {
        books: '#template-book',
      },
      list: {
        bookList: '.books-list',
      },
      all: {
        books: '.book',
        bookImages: '.book__image', 
      },
      form: {
        filters: '.filters',
      },
      container: '.container',
    };
  
    const classNames = {
      book: {
        hiddenBook: 'hidden',
        favorite: 'favorite',
      },
    }; 
  
    const templates = {
      book: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
    };
    
    class BookList {
      constructor(){
        const thisBookList = this;
        
        thisBookList.initData();
        thisBookList.getElements();
        thisBookList.render();
        thisBookList.initActions();
      }
  
      initData() {
        const thisBookList = this;
        
        thisBookList.data = dataSource;
        thisBookList.data.books = dataSource.books;
  
      }
  
      getElements() {
        const thisBookList = this;
        
        thisBookList.dom = {};
        thisBookList.dom.wrapper = document.querySelector(select.container);
        thisBookList.dom.bookList = document.querySelector(select.list.bookList);
        thisBookList.dom.books = document.querySelectorAll(select.all.books);
        thisBookList.dom.bookImages = document.querySelectorAll(select.all.bookImages);
        thisBookList.dom.filterform = document.querySelector(select.form.filters);
        thisBookList.favoriteBooks = [];
        thisBookList.filters = [];
      }
  
      render() {
        const thisBookList = this; 
  
        for(let bookData of thisBookList.data.books) {
          bookData.ratingBgc = thisBookList.determineRatingBgc(bookData.rating);
          bookData.ratingWidth = bookData.rating * 10;
          console.log('bookData: ', bookData);
          const html = templates.book(bookData);
          const bookDOM = utils.createDOMFromHTML(html); 
          thisBookList.dom.bookList.appendChild(bookDOM);
        }
  
      }
    
      initActions() {
        const thisBookList = this;
        
        const favoriteBooks = thisBookList.favoriteBooks;
  
        thisBookList.dom.bookList.addEventListener('dblclick', function(event) {
          event.preventDefault();
          
          if(event.target.parentNode.parentNode.classList.contains('book__image')) {
            event.target.parentNode.parentNode.classList.toggle(classNames.book.favorite); 
            const bookId = event.target.parentNode.parentNode.getAttribute('data-id');
          
            if(event.target.parentNode.parentNode.classList.contains(classNames.book.favorite)) {
              favoriteBooks.push(bookId);
          
            } else {
              const index = favoriteBooks.indexOf(bookId);
              favoriteBooks.splice(index, 1);
            }
          }
        });
        
        thisBookList.dom.filterform.addEventListener('change', function(event) {
          event.preventDefault();
          console.log('event: ', event);
          if(event.srcElement.tagName == 'INPUT' 
          && event.srcElement.type == 'checkbox' 
          && event.srcElement.name == 'filter') {
            
            if(event.srcElement.checked == true
              && !thisBookList.filters.includes(event.srcElement.value)) {
              thisBookList.filters.push(event.srcElement.value);
              thisBookList.bookFilter();
  
            } else if(event.srcElement.checked == false) {
              const index = thisBookList.filters.indexOf(event.srcElement.value);
              thisBookList.filters.splice(index, 1);
              thisBookList.bookFilter();
            }
            console.log('thisBookList.filters: ', thisBookList.filters);
          }
        });
      }
  
      bookFilter() {
        const thisBookList = this; 
  
        for(let book of thisBookList.data.books) { 
          let shouldBeHidden = false;
          for(let filter of thisBookList.filters) { 
            console.log('filter: ', filter);
            if(!book.details[filter]) { 
              console.log('book.details: ', book.details);
              console.log('book.details[filter]: ', book.details[filter]);
              shouldBeHidden = true; 
              break;
            }
          }
          
          const bookImg = document.querySelector('.book__image[data-id=' + '"' + book.id + '"]');
            
          if(shouldBeHidden) {
            bookImg.classList.add(classNames.book.hiddenBook); 
          } else {
            bookImg.classList.remove(classNames.book.hiddenBook);
          }
        }
      }
  
      determineRatingBgc(rating) {
        let background = '';
          
        if(rating < 6) {
          background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
        } else if (rating > 6 && rating <= 8) {
          background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
        } else if (rating > 8 && rating <= 9) {
          background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
        } else if (rating >9) {
          background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
        }
  
        return background;
      }
    }
  
    const app = new BookList();
    console.log('app: ', app);
  }