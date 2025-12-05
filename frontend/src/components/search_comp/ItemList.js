import React from 'react';


const ItemList = ({ items, onSelectItem, itemType, isVisible }) => {
    return (
      <div className={`mb-4 ${isVisible ? 'block' : 'hidden'}`}>
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-gray-700 p-2 rounded-lg mb-2 w-screen max-w-22 cursor-pointer text-gray-400 hover:bg-opacity-50 flex items-center gap-3"
            onClick={() => onSelectItem(item)}
          >
            {itemType === 'book' ? (
              <>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-12 h-16 object-cover rounded" />
                )}
                <div>
                  <div className="font-medium">{item.title} {item.author && `- ${item.author.authorName}`}</div>
                  <div className="text-sm text-gray-400">{item.category} • {item.price}</div>
                </div>
              </>
            ) : itemType === 'borrower' ? (
              <>
                {item.borrowerName} - {item.borrowerEmail}
              </>
            ) : itemType ==='author' ? (
              <>
                {item.authorName} - {item.authorEmail}
              </>
            ) :itemType ==='bookcheckin' ?(
              <>
                {item.title} - {item.category} - {item.price} -Borrowed by: {item.borrower.borrowerName}
              </>): null }
          </div>
        ))}
      </div>
    );
  };
export default ItemList;