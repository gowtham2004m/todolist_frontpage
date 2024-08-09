const apiRequest = async (url = '', optionsObj = null) => {
  try {
    const response = await fetch(url, optionsObj);
    if (!response.ok) throw new Error('Request failed');
    return await response.json();
  } catch (err) {
    return { error: err.message };
  }
};
