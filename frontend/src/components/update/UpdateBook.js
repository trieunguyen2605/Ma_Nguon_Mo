import React, { useState } from 'react';
import SearchBar from '../search_comp/SearchBar';
import ItemList from '../search_comp/ItemList';


const UpdateBook = () => {
    const [formData, setFormData] = useState({
        bookId: '',
        title: '',
        authorName: '',
        category: '',
        price: '',
        preAuthorID: '',
        imageUrl: '',
        description: ''
    });

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showBookList, setShowBookList] = useState(true);

    const handleSearch = async (query) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URI}/api/books/search?query=${query}`);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        }
    };

    const handleSelectBook = async (book) => {
        setSelectedBook(book);
        const authorId = book.author?._id; 
        if (!authorId) {
            console.error('Author ID not found for selected book.');
        }
        setShowBookList(false);
        setFormData({
            bookId: book._id,
            title: book.title,
            authorName: book?.author?.authorName || '',
            category: book.category || '', 
            price: book.price ? book.price.toString() : '',
            preAuthorID: authorId || '',
            imageUrl: book.imageUrl || '',
            description: book.description || ''
        });
    };

    const handleReset = () => {
        setFormData({
            bookId: '',
            title: '',
            authorName: '',
            category: '',
            price: '',
            preAuthorID: '',
            imageUrl: '',
            description: ''
        });
        setBooks([]);
        setSelectedBook(null);
        setShowBookList(true);
    };
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                if (!formData.bookId) {
                    alert('No book selected to update. Please select a book first.');
                    return;
                }

                // Build payload: ensure numeric price and include preAuthorID if missing
                const payload = { ...formData };
                // ensure price is a number when possible
                if (payload.price !== undefined && payload.price !== null && payload.price !== '') {
                    const parsed = Number(payload.price);
                    payload.price = Number.isNaN(parsed) ? payload.price : parsed;
                } else {
                    delete payload.price; // don't send empty string
                }

                // ensure preAuthorID exists when we have a selectedBook with an author
                if ((!payload.preAuthorID || payload.preAuthorID === '') && selectedBook && selectedBook.author && selectedBook.author._id) {
                    payload.preAuthorID = selectedBook.author._id;
                }

                console.debug('UpdateBook payload:', payload);

                const response = await fetch(`${process.env.REACT_APP_API_URI}/api/books`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const resultText = await response.text();
                let result = null;
                try { result = JSON.parse(resultText); } catch { result = resultText; }

                if (response.ok) {
                    alert('Book updated successfully');
                    console.log('Book updated successfully!', result);
                    setSelectedBook(null);
                    setShowBookList(true);
                    setBooks([]);
                    setFormData({
                        bookId: '',
                        title: '',
                        authorName: '',
                        category: '',
                        price: '',
                        preAuthorID: '',
                        imageUrl: '',
                        description: ''
                    });
                } else {
                    console.error('Update failed', response.status, result);
                    alert(`Update failed: ${response.status} - ${typeof result === 'string' ? result : (result && result.error ? result.error : JSON.stringify(result))}`);
                }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    return (
        <div className="p-8 flex justify-center">
            <div className='w-full max-w-xl'>
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Update Book</h1>
                {!selectedBook ? (<>
                <SearchBar onSearch={handleSearch} selectedItem={selectedBook} placeholder="Search Books..." />
                <ItemList items={books} onSelectItem={handleSelectBook} itemType="book" isVisible={showBookList} />
                </>) : (
                    <>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className="bg-gray-800 rounded-xl p-6 mb-4 shadow-md ring-1 ring-gray-700">
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Book Title"
                                    required
                                    className="w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="authorName" className="block text-sm font-semibold text-gray-200 mb-1">Author</label>
                                <input
                                    type="text"
                                    name="authorName"
                                    id="authorName"
                                    placeholder="Author Name"
                                    required
                                    className="w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700"
                                    value={formData.authorName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='md:grid md:grid-cols-2 md:gap-4'>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-200 mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        id="category"
                                        placeholder="Category"
                                        className="w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700"
                                        value={formData.category}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-200 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        placeholder="Price"
                                        required
                                        className="w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-200 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    id="imageUrl"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                />
                                {formData.imageUrl && (
                                    <div className='mt-3 flex justify-center'>
                                        <img src={formData.imageUrl} alt="Preview" className='w-36 h-48 object-cover rounded-md shadow-inner border border-gray-700' />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-200 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={4}
                                    placeholder="Short description or content of the book"
                                    className="w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition">
                        Update Book
                    </button>
                </form>
                <div className="mt-3">
                    <button onClick={handleReset} className="w-full bg-red-700 text-white py-3 rounded-md mt-3 hover:bg-red-600 transition">
                        Cancel
                    </button>
                </div>
                </>) }
            </div>
        </div>
    );
};

export default UpdateBook;