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

  console.log(items);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('data not received');
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
    const id = items.length ? items[items.length - 1]._id + 1 : 1;
    const addNewItem = { id, checked: false, item };
    const listItems = [...items, addNewItem];
    setItems(listItems);

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addNewItem),
    };

    const result = await apiRequest(API_URL, postOptions);
    if (result) {
      setFetchError(result);
      setItems(items); // Rollback to previous state if the request fails
    }
  };

  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);

    const myItem = listItems.find((item) => item._id === id);

    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checked: myItem.checked }),
    };

    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) {
      setFetchError(result);
      setItems(items); // Rollback to previous state if the request fails
    }
  };

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item._id !== id);
    setItems(listItems);

    const deleteOptions = {
      method: 'DELETE',
    };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) {
      setFetchError(result);
      setItems(items); // Rollback to previous state if the request fails
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
            items={Array.isArray(items) ? items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            ) : []}
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
