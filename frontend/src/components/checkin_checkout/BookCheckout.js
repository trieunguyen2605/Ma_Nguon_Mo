import React, {lazy,startTransition, useState } from 'react';
// import CheckoutReceipt from './CheckoutReceipt';
// import SearchBar from '../search_comp/SearchBar';
// import ItemList from '../search_comp/ItemList';

const CheckoutReceipt = lazy(() => import('./CheckoutReceipt'));
const SearchBar = lazy(() => import('../search_comp/SearchBar'));
const ItemList = lazy(() => import('../search_comp/ItemList'));

const BookCheckout = () => {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [searchedBook, setSearchedBook] = useState(null);
  const [searchedBorrower, setSearchedBorrower] = useState(null);
  const [confirmCheckout, setConfirmCheckout] = useState('');
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [showBookList, setShowBookList] = useState(true);
  const [showBorrowerList, setShowBorrowerList] = useState(true);
  const [showSelectedItems, setShowSelectedItems] = useState(false);

  const handleBookSearch = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/books/searchout?query=${query}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const handleBorrowerSearch = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/borrowers/search?query=${query}`);
      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  };

  const handleItemSelect = (item, itemType) => {
    startTransition(() => {
    if (itemType === 'book') {
      setSearchedBook(item);
      setSelectedBook(item);
      setShowBookList(false);
      
    } else if (itemType === 'borrower') {
      setSearchedBorrower(item);
      setSelectedBorrower(item);
      setShowBorrowerList(false);
    }
  });
  };

  const handleContinue = () => {
    startTransition(() => {
    // allow either searched* or selected* to be used (defensive)
    const hasBook = searchedBook || selectedBook;
    const hasBorrower = searchedBorrower || selectedBorrower;
    if (hasBook && hasBorrower) {
      // if searched values are missing but selected exist, populate searched* so downstream matches expectation
      if (!searchedBook && selectedBook) setSearchedBook(selectedBook);
      if (!searchedBorrower && selectedBorrower) setSearchedBorrower(selectedBorrower);
      // populate default borrow/return dates if not already set
      const today = new Date();
      const defaultBorrow = today.toISOString().slice(0,10);
      const defaultReturnDate = new Date(today);
      defaultReturnDate.setDate(defaultReturnDate.getDate() + 5);
      const defaultReturn = defaultReturnDate.toISOString().slice(0,10);
      if (!borrowDate) setBorrowDate(defaultBorrow);
      if (!returnDate) setReturnDate(defaultReturn);
      setShowSelectedItems(true);
    } else {
      alert('Please select both a book and a borrower.');
    }
  });
  }

  const handleReset = () => {
    startTransition(() => {
      setBooks([]);
      setBorrowers([]);
      setSearchedBook(null);
      setSearchedBorrower(null);
      setConfirmCheckout('');
      setSelectedBook(null);
      setSelectedBorrower(null);
      setShowSelectedItems(false);
      setShowBookList(true);
      setShowBorrowerList(true);
    });
  };
  

  const handleCheckout = () => {
    if (confirmCheckout === 'checkout' && searchedBook && searchedBorrower) {
      const bookId = searchedBook._id;
      const borrowerId = searchedBorrower._id;

      // send dates (ISO) if provided
      const payload = { bookId, borrowerId };
      if (borrowDate) payload.borrowDate = new Date(borrowDate).toISOString();
      if (returnDate) payload.returnDate = new Date(returnDate).toISOString();

      fetch(`${process.env.REACT_APP_API_URI}/api/books/checkout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.ok) {
            alert('Book checked out successfully!');
            // Reset state and form data
            setSearchedBook(null);
            setSearchedBorrower(null);
            setConfirmCheckout('');
            setSelectedBook(null);
            setSelectedBorrower(null);
            setShowSelectedItems(false); // Hide selected items
            setBorrowDate("");
            setReturnDate("");
          } else {
            throw new Error('Failed to checkout book');
          }
        })
        .catch((error) => {
          console.error('Error checking out book:', error);
          alert('Error checking out book. Please try again.');
        });
    } else {
      alert('Please type "checkout" in the confirmation box and select both a book and a borrower.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Book Checkout</h1>
      {!showSelectedItems && (
          <SearchBar
            placeholder="Search Book..."
            onSearch={handleBookSearch}
            selectedItem={selectedBook}
          /> 
      )}
          <ItemList
            items={books}
            onSelectItem={(item) => handleItemSelect(item, 'book')}
            itemType="book"
            isVisible={showBookList}
          />
      {!showSelectedItems && (
          <SearchBar
            placeholder="Search Borrower..."
            onSearch={handleBorrowerSearch}
            selectedItem={selectedBorrower}
          />
      )}
          <ItemList
            items={borrowers}
            onSelectItem={(item) => handleItemSelect(item, 'borrower')}
            itemType="borrower"
            isVisible={showBorrowerList}
          />
      {!showSelectedItems && (
        <>
          <div className="mt-2">
            <button
              type="button"
              className="bg-blue-700 text-white py-4 mb-4 w-full rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="bg-red-100 text-red-500 py-4 mb-4 w-full rounded font-semibold hover:bg-red-200 ring-4 ring-red-300 focus:ring-4 focus:ring-red-500 focus:cursor-alias"
              onClick={handleReset}
            >
                Clear
            </button>
          </div>
        </>
      )}
     
      {showSelectedItems && (
        <>
          <CheckoutReceipt selectedBook={selectedBook} selectedBorrower={selectedBorrower} borrowDate={borrowDate} returnDate={returnDate} />
        <form onSubmit={(e) => e.preventDefault()} className='w-screen max-w-md'>
          <div className="bg-gray-700 rounded-lg p-4 mt-4">
            <div className="mb-4">
              <label htmlFor="confirmation" className="block">Confirmation</label>
              <input
                type="text"
                id="confirmation"
                placeholder="Type 'checkout' to confirm"
                className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                value={confirmCheckout}
                onChange={(e) => setConfirmCheckout(e.target.value)}
              />
            </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Borrow Date</label>
                  <input type="date" className="w-full rounded-md p-2" value={borrowDate} onChange={(e)=>setBorrowDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm">Return Date</label>
                  <input type="date" className="w-full rounded-md p-2" value={returnDate} onChange={(e)=>setReturnDate(e.target.value)} />
                </div>
              </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="bg-blue-700 text-white py-4 mb-4 w-full rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500"
                onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </form>
          <div className="mt-4">
            <button
              type="button"
              className="bg-red-100 text-red-500 py-4 mb-4 w-full rounded font-semibold hover:bg-red-200 ring-4 ring-red-300 focus:ring-4 focus:ring-red-500 focus:cursor-alias"
              onClick={handleReset}
            >
              Cancel
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default BookCheckout;
