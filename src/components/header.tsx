import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAccessTokenStore } from '../store';

export const Header = () => {
  const accessToken = useAccessTokenStore((state) => state.accessToken);

  const logout = () => {
    useAccessTokenStore.persist.clearStorage();
    window.location.href = '/';
  };

  return (
    <div className="flex w-full justify-between h-[4rem] items-end px-5">
      <NavLink to={accessToken ? 'todo' : '/'}>
        <div className="text-4xl font-bold">TODO LIST</div>
      </NavLink>
      {!!accessToken && (
        <div className="flex gap-2">
          <NavLink to="join">
            <span>마이페이지</span>
          </NavLink>
          <span onClick={logout} className="cursor-pointer">
            로그아웃
          </span>
        </div>
      )}
    </div>
  );
};
