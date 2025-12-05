import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../search_comp/SearchBar";

const ShowItemList = ({ items, openItems, toggleItem, type, large }) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item._id}
            onClick={() => toggleItem(index)}
            className={`rounded-lg transition-shadow ${openItems.includes(index) ? 'shadow-lg' : 'shadow-md hover:shadow-lg'} bg-gradient-to-br from-gray-800 to-gray-700 cursor-pointer overflow-hidden`}
          >
            {openItems.includes(index) ? (
              <div className="p-4 flex flex-col gap-4 text-gray-100 h-full">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className={`${large ? 'w-full h-64' : 'w-full h-48'} object-cover rounded-md`} />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.author && <p className="text-sm text-gray-300">Author: {item.author.authorName}</p>}
                  <p className="mt-1 text-sm text-gray-300">Category: {item.category}</p>
                  <p className="text-sm text-gray-300">Price: {item.price}</p>
                  {item.borrower && (
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Borrower: {item.borrower.borrowerName}</p>
                      <p>Email: {item.borrower.borrowerEmail}</p>
                      <p>Phone: {item.borrower.borrowerPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 flex items-center gap-3 text-gray-200">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className={`${large ? 'w-24 h-32' : 'w-14 h-20'} object-cover rounded-md`} />
                )}
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.author && item.author.authorName} • {item.category}</div>
                </div>
              </div>
            )}
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
          <button
            onClick={handleClearSearch}
            className="ml-1 mb-4 px-4 py-2 rounded-full font-bold bg-red-100 text-red-700 hover:bg-red-300 focus:ring-2 focus:ring-red-300"
          >
            X
          </button>
        </div>
        <div className={`w-full ${large ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'}`}>
          <ShowItemList
            items={books}
            openItems={openItems}
            toggleItem={toggleItem}
            type={type}
            large={large}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowBooks;
