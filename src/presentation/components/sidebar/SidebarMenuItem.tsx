import { NavLink } from 'react-router-dom';
import { MenuRoute } from '../../router/router';

export const SidebarMenuItem = ({
  to,
  icon,
  title,
  description,
}: MenuRoute) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors'
          : 'flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors'
      }
    >
      <i className={`text-2xl ${icon} mr-4 text-indigo-400`} />
      <div className='flex flex-col'>
        <span className='text-white font-bold text-lg'>{title}</span>
        <span className='text-sm text-gray-400'>{description}</span>
      </div>
    </NavLink>
  );
};
