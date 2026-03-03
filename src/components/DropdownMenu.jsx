import { FiEdit, FiTrash2 } from "react-icons/fi";

export function DropdownMenu({ item, onEdit, onDelete }) {
  return (
    <div className="dropdownMenu">
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
}
