import { forwardRef } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "@/App.css";

export const DropdownMenu = forwardRef(function DropdownMenu(
  { item, onEdit, onDelete },
  ref,
) {
  return (
    <div className="dropdownMenu" ref={ref}>
      <button className="dropdownItem" onClick={(e) => onEdit(e, item)}>
        <FiEdit />
        Edit
      </button>

      <button
        className="dropdownItem dropdownItemDanger"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item);
        }}
      >
        <FiTrash2 />
        Delete
      </button>
    </div>
  );
});
