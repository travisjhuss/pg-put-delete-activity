$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', deleteBook);
  $('#bookShelf').on('click', '.markReadBtn', markAsRead);
  $('#bookShelf').on('click', '.editBtn', editBook);

  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {

  // if in add mode, run post
  if (mode === 'add') {

    $.ajax({
      type: 'POST',
      url: '/books',
      data: bookToAdd,
    }).then(function (response) {
      console.log('Response from server.', response);
      $('#author').val('');
      $('#title').val('');
      refreshBooks();
    }).catch(function (error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
  } else if (mode === 'edit') {
    // if in edit mode, run put
    console.log('in edit mode');
    
    $.ajax({
      type: 'PUT',
      url: `/books/edit/${bookId}`,
      data: bookToAdd

    }).then(function (response) {
      console.log('updated');
      $('#author').val('');
      $('#title').val('');
      mode = 'add';
      refreshBooks();

    }).catch(function (error) {
      alert('error updating');
    }) // end ajax
  } else {
    alert('something is broken, and its not just this country');
    
  }

} // ene addBook

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr data-id=${book.id}></tr>`);
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button class="markReadBtn">Mark as Read</button></td>`);
    $tr.append(`<td><button class="deleteBtn">Delete</button></td>`);
    $tr.append(`<td><button class="editBtn">Edit</button></td>`);
    $('#bookShelf').append($tr);
  }
}

// delete book from database

function deleteBook() {
  console.log('clicked delete');
  const id = $(this).closest('tr').data('id');
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: `/books/${id}`

  }).then(function (response) {
    refreshBooks();
  }).catch(function (error) {
    alert('error in delete');
  }); // end ajax


} // end deleteBook


function markAsRead() {
  console.log('clicked mark as read');
  const id = $(this).closest('tr').data('id');
  console.log(id);
  const dataToSend = {
    readStatus: 'read'
  }

  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    data: dataToSend

  }).then(function (response) {
    console.log('updated');
    refreshBooks();

  }).catch(function (error) {
    alert('error updating');
  }) // end ajax

} // end markAsRead

let mode = 'add';

let bookId;


function editBook() {

  console.log('clicked edit');
  bookId = $(this).closest('tr').data('id');
  mode = 'edit';
  const currentRow = $(this).closest('tr');
  const bookTitle = currentRow.find("td:eq(0)").text();
  const bookAuthor = currentRow.find("td:eq(1)").text();

  console.log(bookTitle, bookAuthor);
  $('#heading').empty().append('Edit Book <button class="cancelBtn">Cancel</button>');
  $('#author').val(bookAuthor);
  $('#title').val(bookTitle);

} // end editBook
