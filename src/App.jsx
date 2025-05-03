import { useState, useEffect } from "react";
import { BiBook, BiCheckSquare, BiTrash, BiListUl, BiGrid } from "react-icons/bi";

export default function BookProgressTracker() {
  // State management
  const [books, setBooks] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    totalPages: 0,
    currentPage: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Load books from localStorage on component mount
  useEffect(() => {
    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Save books to localStorage whenever books state changes
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  // Handle input changes for new book form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]:
        name === "totalPages" || name === "currentPage"
          ? parseInt(value) || 0
          : value,
    });
  };

  // Add a new book
  const addBook = () => {
    if (!newBook.title || !newBook.author || newBook.totalPages <= 0) return;

    const book = {
      id: Date.now().toString(),
      ...newBook,
      completed: false,
      dateAdded: new Date().toISOString(),
    };

    setBooks([...books, book]);
    setNewBook({ title: "", author: "", totalPages: 0, currentPage: 0 });
    setShowAddForm(false);
  };

  // Update book progress
  const updateProgress = (id, currentPage) => {
    setBooks(
      books.map((book) => {
        if (book.id === id) {
          const updatedPage = Math.min(currentPage, book.totalPages);
          const completed = updatedPage >= book.totalPages;
          return { ...book, currentPage: updatedPage, completed };
        }
        return book;
      })
    );
  };

  // Toggle book completion status
  const toggleCompletion = (id) => {
    setBooks(
      books.map((book) => {
        if (book.id === id) {
          const completed = !book.completed;
          const currentPage = completed ? book.totalPages : book.currentPage;
          return { ...book, completed, currentPage };
        }
        return book;
      })
    );
  };

  // Delete a book
  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  // Calculate reading progress percentage
  const calculateProgress = (currentPage, totalPages) => {
    return Math.round((currentPage / totalPages) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-50 mb-2">
            Book Progress Tracker
          </h1>
          <p className="text-gray-100">Keep track of your reading progress</p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {showAddForm ? "Cancel" : "+ Add New Book"}
          </button>

          <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-gray-700 text-blue-400"
                  : "text-gray-300"
              }`}
            >
              <BiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-gray-700 text-blue-400"
                  : "text-gray-300"
              }`}
            >
              <BiListUl size={20} />
            </button>
          </div>
        </div>

        {/* Add Book Form */}
        {showAddForm && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-50">Add New Book</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-gray-200 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-gray-200 mb-1">
                  Author*
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="totalPages"
                  className="block text-gray-200 mb-1"
                >
                  Total Pages*
                </label>
                <input
                  type="number"
                  id="totalPages"
                  name="totalPages"
                  min="1"
                  value={newBook.totalPages || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="currentPage"
                  className="block text-gray-200 mb-1"
                >
                  Current Page
                </label>
                <input
                  type="number"
                  id="currentPage"
                  name="currentPage"
                  min="0"
                  max={newBook.totalPages}
                  value={newBook.currentPage || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={addBook}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Add Book
              </button>
            </div>
          </div>
        )}

        {/* Books Display */}
        {books?.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-md text-center border border-gray-700">
            <BiBook size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-50 mb-2">
              No books yet
            </h3>
            <p className="text-gray-300 mb-4">
              Start by adding your first book to track your reading progress.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Add Your First Book
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className={`bg-gray-800 p-6 rounded-lg shadow-sm border ${
                  book.completed ? "border-green-600" : "border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-50 line-clamp-1">
                    {book.title}
                  </h3>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-4">{book.author}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>
                      {book.currentPage} / {book.totalPages} pages
                    </span>
                    <span>
                      {calculateProgress(book.currentPage, book.totalPages)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        book.completed ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${calculateProgress(
                          book.currentPage,
                          book.totalPages
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex-1 mr-4">
                    <label htmlFor={`progress-${book.id}`} className="sr-only">
                      Update progress
                    </label>
                    <input
                      type="number"
                      id={`progress-${book.id}`}
                      min="0"
                      max={book.totalPages}
                      value={book.currentPage}
                      onChange={(e) =>
                        updateProgress(book.id, parseInt(e.target.value) || 0)
                      }
                      className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => toggleCompletion(book.id)}
                    className={`p-2 rounded-md ${
                      book.completed
                        ? "bg-green-800 text-green-300"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    <BiCheckSquare size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
            {books.map((book, index) => (
              <div
                key={book.id}
                className={`p-4 ${
                  index !== books.length - 1 ? "border-b border-gray-700" : ""
                } ${book.completed ? "bg-green-900 bg-opacity-20" : ""}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100">
                      {book.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{book.author}</p>
                  </div>

                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>
                        {book.currentPage} / {book.totalPages} pages
                      </span>
                      <span>
                        {calculateProgress(book.currentPage, book.totalPages)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          book.completed ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: `${calculateProgress(
                            book.currentPage,
                            book.totalPages
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        max={book.totalPages}
                        value={book.currentPage}
                        onChange={(e) =>
                          updateProgress(book.id, parseInt(e.target.value) || 0)
                        }
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => toggleCompletion(book.id)}
                      className={`p-2 rounded-md ${
                        book.completed
                          ? "bg-green-800 text-green-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                      title={
                        book.completed
                          ? "Mark as in progress"
                          : "Mark as complete"
                      }
                    >
                      <BiCheckSquare size={20} />
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-700"
                      title="Delete book"
                    >
                      <BiTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Book stats */}
        {books.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
              <p className="text-gray-300 text-sm">Total Books</p>
              <p className="text-2xl font-semibold text-gray-50">{books.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
              <p className="text-gray-300 text-sm">Completed</p>
              <p className="text-2xl font-semibold text-green-500">
                {books.filter((book) => book.completed).length}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
              <p className="text-gray-300 text-sm">In Progress</p>
              <p className="text-2xl font-semibold text-blue-500">
                {
                  books.filter(
                    (book) => !book.completed && book.currentPage > 0
                  ).length
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}