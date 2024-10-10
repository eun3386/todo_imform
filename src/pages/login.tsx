import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccessTokenStore } from '../store';
import AxiosInstanceCreator from '../api';

export const Login = () => {
  const { setAccessToken } = useAccessTokenStore((state) => state);
  const navigate = useNavigate();
  const loginInstance = new AxiosInstanceCreator().create();

  interface InputType {
    email: string;
    password: string;
  }
  const [inputs, setInputs] = useState<InputType>({ email: '', password: '' });

  const handleChangeInputs = (e: any) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleLogin = async () => {
    try {
      const { email, password } = inputs;
      const res = await loginInstance.request({
        method: 'POST',
        url: 'auth/login',
        withCredentials: true,
        data: {
          email,
          password,
        },
      });
      if (res.status === 201) {
        setAccessToken(res.data.accessToken);
        navigate('/todo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-[92%] justify-center px-6 pb-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          EUNJI'S TODO LIST
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={handleChangeInputs}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={handleChangeInputs}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            className="flex w-full justify-center rounded-md bg-indigo-600 mt-4 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleLogin}
          >
            Sign in
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link
            to="/join"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
