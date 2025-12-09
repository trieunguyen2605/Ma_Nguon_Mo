import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CheckoutReceipt = ({ selectedBook, selectedBorrower, borrowDate, returnDate }) => {
  const handleSaveAsPDF = () => {
    const pdfDoc = new jsPDF();
    
    pdfDoc.setFont('helvetica');
    pdfDoc.setFontSize(16);
  
    const { width } = pdfDoc.internal.pageSize;
    const textWidth = pdfDoc.getStringUnitWidth('Checkout Book Receipt') * 6;

    const centerX = (width - textWidth) / 2;

    pdfDoc.text('Checkout Book Receipt', centerX+3, 10);
    pdfDoc.setFontSize(12);
    pdfDoc.text('Selected Book Details', 15, 20);
    const bookData = [
      ['Title', selectedBook?.title || 'N/A'],
      ['Author', selectedBook?.author?.authorName || 'Unknown'],
      ['Category', selectedBook?.category || 'N/A'],
      ['Price', `${(selectedBook?.price ?? 0).toFixed(2)}/-`],
      ['Borrow Date', borrowDate ? new Date(borrowDate).toLocaleDateString() : (selectedBook?.borrowDate ? new Date(selectedBook.borrowDate).toLocaleDateString() : 'N/A')],
      ['Return Date', returnDate ? new Date(returnDate).toLocaleDateString() : (selectedBook?.returnDate ? new Date(selectedBook.returnDate).toLocaleDateString() : 'N/A')],
    ];
    pdfDoc.autoTable({
      startY: 25,
      head: [],
      body: bookData,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 11, fontStyle: 'normal' }
    });
  
    pdfDoc.text('Selected Borrower Details', 15, pdfDoc.autoTable.previous.finalY + 15);
    const borrowerData = [
      ['Name', selectedBorrower?.borrowerName || 'N/A'],
      ['Email', selectedBorrower?.borrowerEmail || 'N/A'],
      ['Address', selectedBorrower?.borrowerAddress || 'N/A'],
    ];
    pdfDoc.autoTable({
      startY: pdfDoc.autoTable.previous.finalY + 20,
      head: [],
      body: borrowerData,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 11, fontStyle: 'normal' }
    });
  
    pdfDoc.save(`CheckoutReceipt-${selectedBook.title}.pdf`);
  };
  
    return (
      <div className="bg-gray-700 text-left rounded-lg p-8 w-screen max-w-md mb-4">
        <div className=' pl-2'>
          <h1 className="text-2xl font-bold text-center mb-4">-:Checkout Receipt:-</h1>
          <h3 className="text-lg font-bold mb-2">Selected Book</h3>
          <p>
            <span className="font-semibold">Title: </span>
            <span className="font-light">{selectedBook?.title || 'N/A'}</span>
          </p>
          <p>
            <span className="font-semibold">Author: </span>
            <span className="font-light">{selectedBook?.author?.authorName || 'Unknown'}</span>
          </p>
          <p>
            <span className="font-semibold">Borrow Date: </span>
            <span className="font-light">{borrowDate ? new Date(borrowDate).toLocaleDateString() : (selectedBook?.borrowDate ? new Date(selectedBook.borrowDate).toLocaleDateString() : 'N/A')}</span>
          </p>
          <p>
            <span className="font-semibold">Return Date: </span>
            <span className="font-light">{returnDate ? new Date(returnDate).toLocaleDateString() : (selectedBook?.returnDate ? new Date(selectedBook.returnDate).toLocaleDateString() : 'N/A')}</span>
          </p>
          <h3 className="text-lg font-bold mt-4 mb-4">Selected Borrower</h3>
          <p className="mt-2 mb-2">
            <span className="font-semibold">Name: </span>
            <span className="font-light">{selectedBorrower?.borrowerName || 'N/A'}</span>
          </p>
          <p className="mt-2 mb-2">
            <span className="font-semibold">Email: </span>
            <span className="font-light">{selectedBorrower?.borrowerEmail || 'N/A'}</span>
          </p>
          <p className="mt-2 mb-2">
            <span className="font-semibold">Phone Number: </span>
            <span className="font-light">{selectedBorrower?.borrowerPhone || 'N/A'}</span>
          </p>
          <p className="mt-2 mb-4">
            <span className="font-semibold">Address: </span>
            <span className="font-light">{selectedBorrower?.borrowerAddress || 'N/A'}</span>
          </p>
          <button
            className="bg-blue-700 text-white py-2 px-4 rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500"
            onClick={handleSaveAsPDF}
          >
            Save as PDF
          </button>
        </div>
      </div>
    );
};
export default CheckoutReceipt;