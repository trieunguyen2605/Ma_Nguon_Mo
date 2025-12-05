import React, { useState } from 'react';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    category: '',
    price: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Book added successfully!');
        setFormData({
          title: '',
          authorName: '',
          category: '',
          price: '',
          imageUrl: '',
        });
      } else {
        console.error('Failed to add book:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className='p-8 flex justify-center'>
      <div className='w-full max-w-xl'>
        <h1 className='text-2xl font-bold text-center mb-6 text-gray-100'>Add New Book</h1>
        <form onSubmit={handleAddBook} className='w-full'>
          <div className='bg-gray-800 rounded-xl p-6 mb-4 shadow-lg ring-1 ring-gray-700'>
            <div className='grid grid-cols-1 gap-4'>
              <div>
                <label htmlFor='title' className='block text-sm font-semibold text-gray-200 mb-1'>Title</label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  placeholder='Book Title'
                  required
                  className='w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700 placeholder-gray-500'
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor='authorName' className='block text-sm font-semibold text-gray-200 mb-1'>Author</label>
                <input
                  type='text'
                  name='authorName'
                  id='authorName'
                  placeholder='Author Name'
                  required
                  className='w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700 placeholder-gray-500'
                  value={formData.authorName}
                  onChange={handleChange}
                />
              </div>

              <div className='md:grid md:grid-cols-2 md:gap-4'>
                <div>
                  <label htmlFor='category' className='block text-sm font-semibold text-gray-200 mb-1'>Category</label>
                  <input
                    type='text'
                    name='category'
                    id='category'
                    placeholder='Category'
                    className='w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700 placeholder-gray-500'
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor='price' className='block text-sm font-semibold text-gray-200 mb-1'>Price</label>
                  <input
                    type='number'
                    name='price'
                    id='price'
                    placeholder='Price'
                    className='w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700 placeholder-gray-500'
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='imageUrl' className='block text-sm font-semibold text-gray-200 mb-1'>Image URL</label>
                <input
                  type='text'
                  name='imageUrl'
                  id='imageUrl'
                  placeholder='https://example.com/image.jpg'
                  className='w-full rounded-md p-3 bg-gray-900 text-gray-100 border border-gray-700 placeholder-gray-500'
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                {formData.imageUrl && (
                  <div className='mt-3 flex justify-center'>
                    <img src={formData.imageUrl} alt='Preview' className='w-36 h-48 object-cover rounded-md shadow-inner border border-gray-700' />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type='submit' className='w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition'>
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
