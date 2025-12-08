import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../search_comp/SearchBar";

const ShowItemList = ({ items, openItems, toggleItem, type, large, onOpen, onDelete }) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item._id}
            onClick={() => onOpen && onOpen(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen && onOpen(item);
              }
            }}
            role="button"
            tabIndex={0}
            className={`relative rounded-lg transition-shadow shadow-md hover:shadow-lg bg-gradient-to-br from-gray-800 to-gray-700 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <div className="p-3 flex items-center gap-3 text-gray-200">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className={`${large ? 'w-24 h-32' : 'w-14 h-20'} object-cover rounded-md`} />
              )}
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-400">tác giả:{item.author && item.author.authorName} 
                  <br />
                  Category:{item.category}</div>
              </div>

              {/* xóa từng sản phẩm  */}
              {type !== 'borrowed' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(item);
                  }}
                  title="Delete book"
                  className="ml-2 inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const ShowBooks = ({ type, large }) => {
  const initialBoooksState = [];
  const [books, setBooks] = useState(initialBoooksState);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const toggleItem = (index) => {
    setOpenItems((prevOpenItems) => {
      // In large mode (totals view) we don't collapse items when clicked again.
      if (large) {
        if (prevOpenItems.includes(index)) return prevOpenItems;
        return [...prevOpenItems, index];
      }

      // Default toggle behavior for non-large views
      if (prevOpenItems.includes(index)) {
        return prevOpenItems.filter((itemIndex) => itemIndex !== index);
      } else {
        return [...prevOpenItems, index];
      }
    });
  };

  // Open modal for a selected book
  const openModal = (book) => {
    setSelectedBook(book);
  };

  // thông báo xóa từng sách 
  const deleteBook = async (book) => {
    const ok = window.confirm(`Xóa sách "${book.title}"? Hành động không thể hoàn tác.`);
    if (!ok) return;
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/api/books`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book._id, authorId: book.author?._id }),
      });
      if (!resp.ok) throw new Error('Failed to delete book');
      // remove from local state
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      setOpenItems([]);
      if (selectedBook && selectedBook._id === book._id) setSelectedBook(null);
      alert('Đã xóa sách');
    } catch (err) {
      console.error(err);
      alert('Xóa không thành công. Kiểm tra console.');
    }
  };

  const closeModal = () => setSelectedBook(null);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      try {
        let response = null;
        if (type === "all") {
          response = await fetch(
            `${process.env.REACT_APP_API_URI}/api/books/search?query=${query}`
          );
        } else if (type === "borrowed") {
          response = await fetch(
            `${process.env.REACT_APP_API_URI}/api/books/searchin?query=${query}`
          );
        } else if (type === "available") {
          response = await fetch(
            `${process.env.REACT_APP_API_URI}/api/books/searchout?query=${query}`
          );
        }

        const data = await response.json();
        // console.log("Response:", data);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching borrowers:", error);
        setBooks([]);
      }
    },
    [type]
  );

  const handleClearSearch = () => {
    setSearchQuery("");
    handleSearch("");
    setBooks(initialBoooksState);
    setOpenItems([]);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // If large view is requested, expand all items by default
  useEffect(() => {
    if (large && books && books.length > 0) {
      setOpenItems(books.map((_, i) => i));
    } else if (!large) {
      setOpenItems([]);
    }
  }, [large, books]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Book List</h1>
      <div className="text-gray-500">
        <div
          className={`flex justify-center mb-4 w-full ${large ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'}`}
          align="center"
        >
          <SearchBar
            onSearch={setSearchQuery}
            placeholder={"Search Books..."}
            value={searchQuery}
            className="mb-0"
          />
          {/* <button
            onClick={handleClearSearch}
            className="ml-1 mb-4 px-4 py-2 rounded-full font-bold bg-red-100 text-red-700 hover:bg-red-300 focus:ring-2 focus:ring-red-300"
          >
            X
          </button> */}

          {/* nút xóa tất cả các sản phẩm  */}
          <button
            onClick={async () => {
              const ok = window.confirm('Xóa toàn bộ sách? Hành động không thể hoàn tác.');
              if (!ok) return;
              try {
                const resp = await fetch(`${process.env.REACT_APP_API_URI}/api/books/all`, { method: 'DELETE' });
                if (!resp.ok) throw new Error('Failed to delete all books');
                // clear local state
                setBooks([]);
                setOpenItems([]);
                // close modal if open
                setSelectedBook(null);
                alert('Đã xóa toàn bộ sách');
              } catch (err) {
                console.error(err);
                alert('Xóa không thành công. Kiểm tra console.');
              }
            }}
            className="ml-2 mb-4 px-4 py-2 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400"
          >
            Delete All
          </button>
        </div>
        <div className={`w-full ${large ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'}`}>
          <ShowItemList
            items={books}
            openItems={openItems}
            toggleItem={toggleItem}
            type={type}
            large={large}
            onOpen={openModal}
            onDelete={deleteBook}
          />
        </div>
      </div>
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 z-10 overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedBook.title}</h2>
              <button onClick={closeModal} className="text-gray-600 dark:text-gray-300 hover:text-gray-800">✕</button>
            </div>
            {selectedBook.imageUrl && (
              <img src={selectedBook.imageUrl} alt={selectedBook.title} className="w-full h-64 object-cover" />
            )}
              <div className="p-4 text-gray-800 dark:text-gray-200">
                <div className="flex justify-center items-start">
                  <div>
                    {selectedBook.author && <p className="text-sm text-gray-600 dark:text-gray-400">Author: {selectedBook.author.authorName}</p>}
                    <p className="text-sm text-gray-600 dark:text-gray-400">Category: {selectedBook.category} • Price: {selectedBook.price}</p>
                  </div>
                </div>

                {selectedBook.description && (
                  <div className="mt-3 text-sm text-gray-700 dark:text-gray-200">{selectedBook.description}</div>
                )}
                {selectedBook.borrower && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>Borrower: {selectedBook.borrower.borrowerName}</p>
                    <p>Email: {selectedBook.borrower.borrowerEmail}</p>
                    <p>Phone: {selectedBook.borrower.borrowerPhone}</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBooks;
