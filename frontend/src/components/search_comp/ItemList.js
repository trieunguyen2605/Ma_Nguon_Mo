import React from 'react';


const ItemList = ({ items, onSelectItem, itemType, isVisible }) => {
    return (
      <div className={`mb-4 ${isVisible ? 'block' : 'hidden'}`}>
        {items.map((item) => (
          <div
            key={item._id}
            className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-3 mb-3 cursor-pointer flex items-center gap-4 shadow-md hover:shadow-lg"
            onClick={() => onSelectItem(item)}
          >
            {itemType === 'book' ? (
              <>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-14 h-20 object-cover rounded-md" />
                )}
                <div className='flex-1 text-gray-100'>
                  <div className="font-medium">{item.title} {item.author && `- ${item.author.authorName}`}</div>
                  <div className="text-sm text-gray-400">{item.category} • {item.price}</div>
                </div>
              </>
            ) : itemType === 'borrower' ? (
              <>
                <div className='text-gray-100'>{item.borrowerName} - {item.borrowerEmail}</div>
              </>
            ) : itemType ==='author' ? (
              <>
                <div className='text-gray-100'>{item.authorName} - {item.authorEmail}</div>
              </>
            ) :itemType ==='bookcheckin' ?(
              <>
                <div className='text-gray-100'>{item.title} - {item.category} - {item.price} -Borrowed by: {item.borrower.borrowerName}</div>
              </>): null }
          </div>
        ))}
      </div>
    );
  };
export default ItemList;