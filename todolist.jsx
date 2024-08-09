import { useState } from "react";

function ParentComp() {
    const [arr, setArr] = useState([]);
    const [inputValue, setInputValue] = useState("");

    function handleClick() {
        if (inputValue.trim() !== "") {  // Trim whitespace
            setArr(prevArr => [...prevArr, inputValue]);
            setInputValue("");
        }
    }

    function handleDeleteItems(idx) {
        setArr(prevArr => prevArr.filter((_, index) => index !== idx));
    }

    function handleEditItems(idx) {
        const updatedContent = prompt("Enter new content:", arr[idx]);
        if (updatedContent !== null && updatedContent.trim() !== "") {
            setArr(prevArr => prevArr.map((value, index) =>
                index === idx ? updatedContent : value
            ));
        }
    }

    return (
        <>
            <label>TODO items:</label>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleClick}>Add</button>
            <ol>
                {arr.map((value, index) => (
                    <li key={index}>
                        {value}
                        <button onClick={() => handleDeleteItems(index)}>Delete</button>
                        <button onClick={() => handleEditItems(index)}>Edit</button>
                    </li>
                ))}
            </ol>
        </>
    );
}

export default ParentComp;
