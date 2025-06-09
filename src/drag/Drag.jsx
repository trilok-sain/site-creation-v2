import React, { useState } from "react";
import "./drag.css";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

const Drag = () => {
  const initialArr = [
    { label: "1", url: "1.png" },
    { label: "2", url: "2.png" },
    { label: "3", url: "3.png" },
    { label: "4", url: "4.png" },
    { label: "5", url: "5.png" },
    { label: "6", url: "6.png" },
    { label: "7", url: "7.png" },
    { label: "8", url: "8.png" },
    { label: "9", url: "9.png" },
    { label: "10", url: "10.png" },
  ];
  const [arr, setArr] = useState(initialArr);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [isChecked, setIsChecked] = useState(Array(arr.length).fill(false));

  // handle the start of dragging on item
  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  // allow dropping by preventing the default behavior
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // handle the drop event and rearrange items
  const handleDrop = (e, dropIndex) => {
    if (draggedItemIndex !== null && draggedItemIndex !== dropIndex) {
      const updatedArr = [...arr];
      const draggedItem = updatedArr[draggedItemIndex];
      updatedArr.splice(draggedItemIndex, 1); // remove dragged item
      updatedArr.splice(dropIndex, 0, draggedItem); // insert dragged item in the new position
      setArr(updatedArr); // update state with new order
      setDraggedItemIndex(null); // reset the dragged item index
    }
  };

  const handleImageCheck = (e, index) => {
    const updatedArr = [...isChecked]
  }

  return (
    <div className="drag">
      {arr.map((item, index) => {
        return (
          <div
            className="dragdiv"
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <img src={item.url} alt={item.label} width={100} height={100} />
            <span onClick={(e) => handleImageCheck(e, index)}>
            {isChecked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Drag;
