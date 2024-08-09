import React, { useState, useEffect } from 'react';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import SearchItem from './SearchItem';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'https://todolist-server-ucfi.onrender.com/items';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("data not received");
        const listItem = await response.json();
        setItems(listItem);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addItem = async (item) => {
    const newItemObj = { item, checked: false };
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItemObj),
    };

    try {
      const response = await fetch(API_URL, postOptions);
      if (!response.ok) throw Error('Failed to add item');
      const result = await response.json();
      setItems([...items, result]);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const handleCheck = async (id) => {
    const itemToCheck = items.find((item) => item._id === id);
    if (!itemToCheck) return;

    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checked: !itemToCheck.checked }),
    };

    try {
      const reqUrl = `${API_URL}/${id}`;
      const response = await fetch(reqUrl, updateOptions);
      if (!response.ok) throw Error('Failed to update item');
      const updatedItem = await response.json();
      setItems(items.map((item) => (item._id === id ? updatedItem : item)));
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const deleteOptions = {
      method: 'DELETE',
    };

    try {
      const reqUrl = `${API_URL}/${id}`;
      const response = await fetch(reqUrl, deleteOptions);
      if (!response.ok) throw Error('Failed to delete item');
      setItems(items.filter((item) => item._id !== id));
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  };

  return (
    <div className="App">
      <Header title="To Do List" />

      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />

      <SearchItem search={search} setSearch={setSearch} />

      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p>{`Error: ${fetchError}`}</p>}
        {!isLoading && !fetchError && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>

      <Footer length={items.length} />
    </div>
  );
}

export default App;
