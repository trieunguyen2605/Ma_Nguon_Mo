import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../search_comp/SearchBar";

const ShowItemList = ({ items, openItems, toggleItem, type }) => {
  return (
    <div className="mb-6">
      {items.map((item, index) => (
        <div
          key={item._id}
          onClick={() => toggleItem(index)}
          className={`mb-3 w-full max-w-md mx-auto rounded-lg transition-shadow ${openItems.includes(index) ? 'shadow-lg' : 'shadow-md hover:shadow-lg'} bg-gradient-to-br from-gray-800 to-gray-700 cursor-pointer`}
        >
          {openItems.includes(index) ? (
            <div className="p-4 flex flex-col md:flex-row gap-4 text-gray-100">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full md:w-40 h-56 object-cover rounded-md" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.author && <p className="text-sm text-gray-300">Author: {item.author.authorName}</p>}
                {item.author && <p className="text-sm text-gray-400">Email: {item.author.authorEmail}</p>}
                <p className="mt-2 text-sm text-gray-300">Category: {item.category}</p>
                <p className="text-sm text-gray-300">Price: {item.price}</p>
                {item.borrower && (
                  <div className="mt-3 text-sm text-gray-300">
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
                <img src={item.imageUrl} alt={item.title} className="w-14 h-20 object-cover rounded-md" />
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
  );
};


const ShowBooks = ({ type }) => {
  const initialBoooksState = [];
  const [books, setBooks] = useState(initialBoooksState);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prevOpenItems) => {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Book List</h1>
      <div className="text-gray-500">
        <div
          className="flex justify-center mb-4 w-full max-w-md"
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
        <div className="w-full max-w-md">
          <ShowItemList
            items={books}
            openItems={openItems}
            toggleItem={toggleItem}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowBooks;
