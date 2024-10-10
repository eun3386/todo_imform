import { useState } from 'react';
import { usePageStore, useTodoStore } from '../store';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, message } from 'antd';

export const AddTask = (props: any) => {
  type RangeValue = [Dayjs | null, Dayjs | null] | null;
  const { addTask } = useTodoStore((state) => state);
  const { setPage } = usePageStore((state) => state);
  const [inputs, setInputs] = useState<any>({});
  const [value, setValue] = useState<RangeValue>([dayjs(), dayjs()]);
  const { RangePicker } = DatePicker;

  const addTodo = async () => {
    const { title, content, memo } = inputs;
    const todo = {
      title: title,
      content: content,
      memo: memo,
      startDate: value && value[0],
      endDate: value && value[1],
    };
    if (title === '') {
      message.error('Title이 비었습니다.');
    } else if (content === '') {
      message.error('Content가 비었습니다.');
    } else if (memo === '') {
      message.error('Memo가 비었습니다.');
    } else {
      addTask(todo);
      setInputs({ title: '', content: '', memo: '' });
      setValue([dayjs(), dayjs()]);
      setPage(0);
    }
  };

  const handleChangeInputs = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setInputs((prev: any) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="newTask"
        >
          New Task
        </label>
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="title"
          name="title"
          placeholder="Tilte"
          required
          value={inputs?.title}
          onChange={handleChangeInputs}
        />
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="newTask"
          placeholder="Enter new task"
          name="content"
          required
          value={inputs?.content}
          onChange={handleChangeInputs}
        />
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="memo"
          placeholder="Memo"
          name="memo"
          required
          value={inputs?.memo}
          onChange={handleChangeInputs}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter') {
              addTodo();
            }
          }}
        />
        <p className="text-xs">시작일 -&gt; 종료일</p>
        <RangePicker
          style={{ marginTop: '0.2rem' }}
          defaultValue={value}
          value={value}
          onChange={(e: RangeValue) => {
            setValue([e && e[0], e && e[1]]);
          }}
        />
      </div>
      <div className="flex items-center pt-6">
        <button
          onClick={addTodo}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-500 h-10 px-4 py-2 w-full"
        >
          Add Task
        </button>
      </div>
    </>
  );
};
