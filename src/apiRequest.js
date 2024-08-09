const apiRequest = async (url = '', optionsObj = null) => {
  try {
    const response = await fetch(url, optionsObj);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.json(); // Return the response data for better error handling
  } catch (err) {
    return { error: err.message }; // Return error message instead of null
  }
};
