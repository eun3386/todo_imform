import React, { useEffect, useRef, useState } from 'react';
import { AddTask } from '../components/addTask';
import { usePageStore, useTodoStore } from '../store';
import { TrashIcon } from '@heroicons/react/20/solid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DatePicker, Popover } from 'antd';
import dayjs from 'dayjs';
import { ModalPopup } from '../components/modalPopup';
export const Todo = () => {
  const { todoList, contents, getTodoList, deleteTask, changeTodo, removeContents } = useTodoStore(
    (state) => state
  );
  const { page, setPage } = usePageStore((state) => state);
  const currentPage = useRef(0);
  const [activeTodo, setActiveTodo] = useState('');
  const [editStartDate, setEditStartDate] = useState(dayjs());
  const [editEndDate, setEditEndDate] = useState(dayjs());
  const [editMode, setEditMode] = useState(false);
  const { RangePicker } = DatePicker;
  const scrollDiv = useRef<HTMLDivElement>(null);
  const [todoInputs, setTodoInputs] = useState({
    title: '',
    content: '',
    memo: '',
    state: '',
    startDate: '',
    endDate: '',
  });

  const getFetch = () => {
    getTodoList(currentPage.current);
    setPage(currentPage.current);
  };

  useEffect(() => {
    getFetch();

    return () => {};
  }, []);

  const handleChangeState = (e: { target: { value: string } }, todo: any) => {
    const { title, content, memo, startDate, endDate } = todo;

    const todoArguments = {
      title,
      content,
      memo: '-',
      state: e.target.value,
      id: todo.id,
      startDate,
      endDate,
    };
    changeTodo(todoArguments);
  };

  const deleteTodo = (id: string) => {
    deleteTask(id);
    currentPage.current = 0;
    setPage(currentPage.current);
  };

  const handleChangetodo = (todo: any) => {
    const todoArguments = {
      ...todoInputs,
      state: todo.state,
      id: todo.id,
      startDate: dayjs(editStartDate).format('YYYY-MM-DD'),
      endDate: dayjs(editEndDate).format('YYYY-MM-DD'),
    };
    changeTodo(todoArguments);
    setEditMode(false);
  };

  const popContent = (todo: any) => {
    const { title, content, memo, state, startDate, endDate } = todo;
    const sd = dayjs(startDate);
    const ed = dayjs(endDate);
    return (
      <>
        {!editMode ? (
          <>
            {/* 상세보기 */}
            <p>Content: {content && content}</p>
            <p>Memo: {memo && memo}</p>
            <RangePicker defaultValue={[sd, ed]} allowClear={false} />
            <button
              className="bg-pink-300"
              onClick={() => {
                setEditMode(true);
                setTodoInputs({
                  title,
                  content,
                  memo,
                  state,
                  startDate,
                  endDate,
                });
              }}
            >
              수정하기
            </button>
          </>
        ) : (
          <>
            {/* 수정하기 */}
            <div className="mb-2">
              <label>
                Content:
                <input
                  type="text"
                  name="content"
                  value={todoInputs.content}
                  onChange={changeTodoInput}
                />
              </label>
            </div>
            <div className="mb-2">
              <label>
                Memo:{' '}
                <input type="text" name="memo" value={todoInputs.memo} onChange={changeTodoInput} />
              </label>
            </div>
            <RangePicker
              defaultValue={[sd, ed]}
              onChange={(e: any) => {
                setEditStartDate(e[0]);
                setEditEndDate(e[1]);
              }}
              allowClear={false}
            />

            <button className="bg-yellow-400" onClick={() => handleChangetodo(todo)}>
              수정
            </button>
          </>
        )}
      </>
    );
  };

  const changeTodoInput = (e: any) => {
    const { name, value } = e.target;
    setTodoInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    if (page === 0) {
      currentPage.current = 0;
      removeContents();
    }

    return () => {};
  }, [page]);

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto mt-10"
      data-v0-t="card"
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold tracking-tight text-2xl">Todo List</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2 max-h-[36vh] overflow-auto" id="scrollableDiv" ref={scrollDiv}>
          <InfiniteScroll
            dataLength={contents?.length || 0}
            next={() => {
              currentPage.current += 1;
              setPage(page + 1);
              getFetch();
            }}
            hasMore={todoList?.pageCount > currentPage.current && !todoList?.last}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {contents?.map((val: any, idx: number) => {
              return (
                <Popover
                  content={() => popContent(val)}
                  key={val.id}
                  title={
                    editMode ? (
                      <label>
                        Title:{' '}
                        <input
                          type="text"
                          name="title"
                          value={todoInputs.title}
                          onChange={changeTodoInput}
                        />
                      </label>
                    ) : (
                      <p className="font-bold">{val.title}</p>
                    )
                  }
                  trigger="click"
                >
                  <div
                    id={val.id}
                    className={`rounded-md m-[1px] p-[4px] grid grid-cols-12 items-baseline ${
                      activeTodo === val.id ? 'border-gray-400 bg-slate-100' : ''
                    }`}
                    onMouseLeave={() => setActiveTodo('')}
                    onMouseEnter={(e) => {
                      setActiveTodo(e.currentTarget.id);
                    }}
                  >
                    <div className="col-span-2">
                      <input
                        type="radio"
                        name={`state${val.id}`}
                        value="ready"
                        checked={val.state === 'ready'}
                        onChange={(e) => handleChangeState(e, val)}
                        className={`mr-1 peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          val.state === 'ready' ? 'bg-gray-600 text-gray-300' : ''
                        }`}
                      />
                      <input
                        type="radio"
                        name={`state${val.id}`}
                        value="process"
                        checked={val.state === 'process'}
                        onChange={(e) => handleChangeState(e, val)}
                        className={`mr-1 peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          val.state === 'process' ? 'bg-green-600 text-green-300' : ''
                        }`}
                      />
                      <input
                        type="radio"
                        name={`state${val.id}`}
                        value="done"
                        checked={val.state === 'done'}
                        onChange={(e) => handleChangeState(e, val)}
                        className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          val.state === 'done' ? 'bg-indigo-600 text-indigo-300' : ''
                        }`}
                      />
                    </div>
                    <label
                      className="col-span-9 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor={`task${val.id}`}
                    >
                      {val.title}
                    </label>
                    <div
                      className={`justify-self-end w-4 text-red-600 cursor-pointer ${
                        activeTodo === val.id ? '' : 'hidden'
                      }`}
                      onClick={() => {
                        deleteTodo(val.id);
                      }}
                    >
                      <TrashIcon />
                    </div>
                  </div>
                </Popover>
              );
            })}
          </InfiniteScroll>
        </div>
        <AddTask />
      </div>
      {/* <ModalPopup title={} open={} onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel} /> */}
    </div>
  );
};
