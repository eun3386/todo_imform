import { useEffect, useRef, useState } from 'react';
import { useAccessTokenStore } from '../store';
import AxiosInstanceCreator from '../api';
import { message } from 'antd';
import { ResultComponent } from '../components/resultComponent';

export const Join = () => {
  const joinInstance = new AxiosInstanceCreator().create();
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  const [result, setResult] = useState(false);
  const [out, setOut] = useState(false);
  interface InputsType {
    email: string;
    name: string;
    oldPassword?: string;
    password?: string;
    passwordConfirmation?: string;
    phone: string;
  }
  const [inputs, setInputs] = useState<InputsType>({
    email: '',
    name: '',
    oldPassword: '',
    password: '',
    passwordConfirmation: '',
    phone: '',
  });
  const [isMatching, setIsMatching] = useState<boolean>(true);
  const passwordConfirm = useRef<any>('');
  const handleChangeInputs = (e: any) => {
    const { name, value } = e.target;
    let number = 0;
    number = value.replace(/[^0-9]/g, '');
    setInputs((prev: any) => {
      if (name === 'phone') {
        return { ...prev, [name]: number };
      } else {
        return { ...prev, [name]: value };
      }
    });

    if (name === 'passwordConfirmation') {
      passwordConfirm.current = e.target.value;
      if (inputs.password !== passwordConfirm.current) {
        setIsMatching(false);
      } else {
        setIsMatching(true);
      }
    }
  };

  const handleCheckDuplicate = async () => {
    try {
      if (!inputs.email.includes('@') || !inputs.email.includes('.')) {
        message.error('이메일 형식이 아닙니다.');
        return;
      }
      const res = await joinInstance.get('auth/emailCheck', {
        params: {
          email: inputs.email,
        },
      });
      if (res.status === 200) {
        message.success('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoin = async () => {
    try {
      if (!isMatching) {
        message.error('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (!inputs.email.includes('@') || !inputs.email.includes('.')) {
        message.error('이메일 형식이 아닙니다.');
        return;
      }
      const emailCheck = await joinInstance.get('auth/emailCheck', {
        params: {
          email: inputs.email,
        },
      });
      if (emailCheck.status === 200) {
        const res = await joinInstance.post('auth/joinUser', inputs);
        if (res.status === 201) {
          setResult(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await joinInstance.get('user');
      if (res.status === 200) {
        const { email, name, phone }: InputsType = res.data;
        setInputs({ email, name, phone });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const putUserInfo = async () => {
    try {
      const res = await joinInstance.put('user', { phone: inputs.phone, name: inputs.name });
      if (res.status === 200) {
        message.success('회원정보 수정이 완료되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const putUserPassword = async () => {
    try {
      if (!isMatching) {
        message.error('비밀번호가 일치하지 않습니다.');
        return;
      }
      const res = await joinInstance.put('user/password', {
        oldPassword: inputs.oldPassword,
        newPassword: inputs.password,
      });
      if (res) {
        message.success('비밀번호 변경이 완료되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async () => {
    try {
      const res = await joinInstance.delete('user', { params: { password: inputs.password } });
      if (res.status === 200) {
        message.success('회원 탈퇴가 완료되었습니다.');
        useAccessTokenStore.persist.clearStorage();
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setInputs({
      email: '',
      name: '',
      oldPassword: '',
      password: '',
      passwordConfirmation: '',
      phone: '',
    });
    if (accessToken) {
      setOut(false);
      getUserInfo();
    }

    return () => {};
  }, []);

  return result ? (
    <ResultComponent />
  ) : !!accessToken && out ? (
    <div className="mt-3">
      <div>
        <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
          Password
        </label>
        <div className="mt-2.5">
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChangeInputs}
            value={inputs?.password}
            autoComplete="given-name"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex justify-end mt-3 gap-2">
        <button
          onClick={() => {
            setOut(false);
            setIsMatching(true);
            setInputs({ ...inputs, oldPassword: '', password: '', passwordConfirmation: '' });
          }}
          className="w-auto justify-self-end break-keep pointer-events-auto rounded-md px-4 py-2 text-center shadow-sm ring-1 ring-slate-700/10 hover:bg-slate-50"
        >
          돌아가기
        </button>
        <button
          onClick={deleteUser}
          className="w-auto justify-self-end break-keep pointer-events-auto rounded-md px-4 py-2 text-center shadow-sm ring-1 ring-slate-700/10 hover:bg-slate-50"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  ) : (
    <>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div
          className="absolute inset-x-0 top-[5rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[4rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{`${
            !!accessToken ? '마이페이지' : '회원 가입'
          }`}</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5 flex gap-3 justify-between">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                readOnly={!!accessToken}
                onChange={handleChangeInputs}
                value={inputs?.email}
                className="block w-[100%] rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {!accessToken && (
                <button
                  onClick={handleCheckDuplicate}
                  className="w-[20%] break-keep pointer-events-auto rounded-md px-4 py-2 text-center shadow-sm ring-1 ring-slate-700/10 hover:bg-slate-50"
                >
                  중복 체크
                </button>
              )}
            </div>
          </div>

          {!!accessToken && (
            <>
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Old Password
                </label>
                <div className="mt-2.5">
                  <input
                    type="password"
                    name="oldPassword"
                    id="oldPassword"
                    onChange={handleChangeInputs}
                    value={inputs?.oldPassword}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <br />
            </>
          )}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2.5">
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChangeInputs}
                value={inputs?.password}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Password confirmation
            </label>
            <div className="mt-2.5">
              <input
                type="password"
                name="passwordConfirmation"
                id="passwordConfirmation"
                onChange={handleChangeInputs}
                value={inputs?.passwordConfirmation}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className={isMatching ? 'hidden' : 'text-red-500'}>비밀번호가 일치하지 않습니다.</p>
          </div>
          {!!accessToken ? (
            <>
              <div></div>
              <button
                onClick={putUserPassword}
                className="w-auto justify-self-end break-keep pointer-events-auto rounded-md px-4 py-2 text-center shadow-sm ring-1 ring-slate-700/10 hover:bg-slate-50"
              >
                비밀번호 변경
              </button>
            </>
          ) : (
            ''
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
              Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChangeInputs}
                value={inputs?.name}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
              Phone number
            </label>
            <div className="relative mt-2.5">
              <input
                type="tel"
                name="phone"
                id="phone"
                onChange={handleChangeInputs}
                value={inputs?.phone}
                autoComplete="tel"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          {!!accessToken ? (
            <>
              <button
                onClick={putUserInfo}
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                회원 정보 수정하기
              </button>
              <p
                onClick={() => {
                  setOut(true);
                  setInputs({ ...inputs, password: '' });
                }}
                className="text-gray-300 underline text-center mt-36 cursor-pointer"
              >
                탈퇴하기
              </p>
            </>
          ) : (
            <button
              onClick={handleJoin}
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              가입하기
            </button>
          )}
        </div>
      </div>
    </>
  );
};
