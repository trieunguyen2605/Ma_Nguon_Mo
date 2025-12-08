import React, { lazy, startTransition, useState } from "react";

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const DeleteAuthor = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [showAuthorList, setShowAuthorList] = useState(true);
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    authorPhone: "",
  });

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/authors/search?query=${query}`
      );
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAuthors([]);
    }
  };

  const handleSelectAuthor = async (author) => {
    startTransition(() => {
      setSelectedAuthor(author);
      setShowAuthorList(false);
      setFormData({
        authorName: author.authorName || "",
        authorEmail: author.authorEmail || "",
        authorPhone: author.authorPhone || "",
      });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setFormData({
        authorName: "",
        authorEmail: "",
        authorPhone: "",
      });
      setAuthors([]);
      setSelectedAuthor(null);
      setShowAuthorList(true);
      setConfirmDelete("");
    });
  };

  const handleDelete = async () => {
    if (confirmDelete === "delete" && selectedAuthor) {
      const { _id: authorId } = selectedAuthor;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URI}/api/authors/${authorId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          alert("Author deleted successfully");
          console.log("Author deleted successfully!");
          setConfirmDelete("");
          setSelectedAuthor(null);
          setAuthors([]);
          handleReset();
        } else {
          alert("Failed to delete author");
        }
      } catch (error) {
        console.error("Error deleting author:", error);
        alert("Error deleting author");
      }
    } else {
      alert('Please type "delete" in the confirmation box to delete the author.');
    }
  };

  return (
    <div className="p-14">
      <h1 className="text-2xl font-bold text-center mb-6">Delete Author</h1>
      {!selectedAuthor ? (
        <>
          <SearchBar
            onSearch={handleSearch}
            selectedItem={selectedAuthor}
            placeholder="Search Authors..."
          />
          <ItemList
            items={authors}
            onSelectItem={handleSelectAuthor}
            itemType="author"
            isVisible={showAuthorList}
          />
        </>
      ) : (
        <>
          <FormComp 
            form_data={formData}
            setConfirm={setConfirmDelete}
            type="deleteauthor" />
          <div className="mt-2">
            <button
              onClick={handleReset}
              className="bg-blue-700 text-white py-4 mb-4 w-full rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:cursor-alias"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-500 py-4 mb-4 w-full rounded font-semibold hover:bg-red-200 ring-2 ring-red-300 focus:ring-4 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteAuthor;
