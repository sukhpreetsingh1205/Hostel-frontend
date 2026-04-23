import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ items = [] }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="menu p-0">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? 'active font-semibold' : undefined)}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
