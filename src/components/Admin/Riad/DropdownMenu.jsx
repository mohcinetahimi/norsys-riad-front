import React from 'react';

const DropdownMenu = ({ items, onSelect }) => {
  return (
    <div className="fixed right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(item)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
  