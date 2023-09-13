// DOM elements
const bookGrid = document.querySelector('.book-grid');
const modalButton = document.querySelector('.add-book');
const modal = document.querySelector('dialog');
const newBookForm = document.forms.newBookForm;

// Library to store books
const myLibrary = [];

// Book constructor function
class Book {
  constructor(title, author, chapters, read) {
    this.title = title;
    this.author = author;
    this.chapters = chapters;
    this.read = read;
  }
  // Prototype method to change read status
  changeReadStatus() {
    this.read = this.read === 'Read' ? 'Not Read' : 'Read';
  }
}

// Function to set color of buttons depending on read status
const setButtonColor = (element) =>
  element.textContent === 'Read'
    ? (element.className = 'read')
    : (element.className = 'unread');

// Function to add a book to the library and update the display
const addBookToLibrary = () => {
  // Clear the book grid
  bookGrid.textContent = '';

  // Iterate through the library and create book elements
  for (const index in myLibrary) {
    const bookInfo = document.createElement('div');
    const elements = ['title', 'author', 'chapters', 'read'];

    for (const element of elements) {
      let bookData;

      if (element === 'read') {
        // Create a button for read status
        bookData = document.createElement('button');
        bookData.textContent = `${myLibrary[index][element]}`;
        bookData.dataset.readIndex = `${index}`;
        setButtonColor(bookData);
      } else {
        // Create a paragraph for other book data
        bookData = document.createElement('p');
        bookData.textContent = `${element
          .charAt(0)
          .toUpperCase()}${element.slice(1)}: ${myLibrary[index][element]}`;
      }

      bookInfo.dataset.index = `${index}`;
      bookInfo.appendChild(bookData);
    }

    // Create a delete button for each book
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Book';
    deleteButton.classList.add('btn');
    deleteButton.dataset.index = `${index}`;

    bookInfo.appendChild(deleteButton);
    bookGrid.appendChild(bookInfo);
  }
};

// Function to refresh data index attributes
const refreshDataIndex = () => {
  const indexLists = [
    'button[data-index]',
    'div[data-index]',
    'button[data-read-index]',
  ];

  for (const list of indexLists) {
    const nodeList = Array.from(document.querySelectorAll(list));

    if (list !== 'button[data-read-index]') {
      for (let index in nodeList) {
        nodeList[index].dataset.index = `${index}`;
      }
    } else {
      for (let index in nodeList) {
        nodeList[index].dataset.readIndex = `${index}`;
      }
    }
  }
};

// Function to delete a book
const deleteBook = (e) => {
  // Remove the book from the library
  myLibrary.splice(+e.target.dataset.index, 1);

  // Remove the corresponding book element from the display
  document.querySelectorAll('div[data-index]').forEach((div) => {
    if (div.dataset.index != e.target.dataset.index) return;
    bookGrid.removeChild(div);
  });

  // Refresh data index attributes
  refreshDataIndex();
};

// Function to add event listeners to delete buttons
const addDeleteButton = () => {
  const deleteButtons = document.querySelectorAll('button[data-index]');

  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteBook);
  });
};

// Function to toggle the read status of a book
const toggleReadStatus = (e) => {
  // Toggle the read status in the library
  myLibrary[+e.target.dataset.readIndex].changeReadStatus();

  // Update the button text to reflect the new read status
  document.querySelectorAll('button[data-index]').forEach((button) => {
    if (button.dataset.index != e.target.dataset.readIndex) return;
    e.target.textContent =
      e.target.textContent === 'Read' ? 'Not Read' : 'Read';
    setButtonColor(e.target);
  });
};

// Function to add event listeners to read status toggle buttons
const addReadStatusToggleButton = () => {
  const readStatusToggleButtons = document.querySelectorAll(
    'button[data-read-index]'
  );

  readStatusToggleButtons.forEach((readStatusToggleButton) => {
    readStatusToggleButton.addEventListener('click', toggleReadStatus);
  });
};

// Function to create a new book and add it to the library
const createBook = () => {
  const formData = new FormData(newBookForm);
  const bookTitle = formData.get('title');
  const bookAuthor = formData.get('author');
  const bookChapters = formData.get('chapters');
  const bookReadStatus =
    formData.get('readStatus') === 'true' ? 'Read' : 'Not Read';

  // Create a new book object
  const newBook = new Book(bookTitle, bookAuthor, bookChapters, bookReadStatus);

  // Add the new book to the library
  myLibrary.push(newBook);

  // Update the display
  addBookToLibrary();
  addDeleteButton();
  addReadStatusToggleButton();

  // Reset the form
  newBookForm.reset();
};

// Function to show the modal
const showModal = () => modal.showModal();

// Function to close the modal when clicking outside
const closeModal = (e) => {
  if (!e.target.contains(modal)) return;
  modal.close();
};

// Event listeners
newBookForm.addEventListener('submit', createBook);
modalButton.addEventListener('click', showModal);
document.addEventListener('click', closeModal);
