import { create } from 'zustand'; // create로 zustand를 불러옵니다.
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AxiosInstanceCreator from './api';

export const todoInstance = new AxiosInstanceCreator().create();
interface AccessTokenState {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
}

export interface BearsState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

export interface TodoState {
  todoList: any;
  contents: [];
  removeContents: () => void;
  changeTodo: (todo: any) => void;
  getTodoList: (page: number) => void;
  addTask: (todo: any) => void;
  deleteTask: (todoId: string) => void;
}

export interface ModalState {
  title: string;
  open: boolean;
  handleOk: () => void;
  confirmLoading: boolean;
  handleCancel: () => void;
  modalText: string;
}

interface pageState {
  page: number;
  setPage: (page: number) => void;
}

export const useAccessTokenStore = create<AccessTokenState>()(
  persist(
    (set) => ({
      accessToken: '',
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'access-token-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useBearStore = create<BearsState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export const useTodoStore = create<TodoState>()(
  devtools((set, get) => ({
    todoList: {
      totalCount: 0,
      pageCount: 0,
      contents: [],
    },
    contents: [],
    removeContents: () => set({ contents: [] }),
    changeTodo: async (todo) => {
      try {
        const response: any = await todoInstance.put<any>(`todo/${todo.id}`, todo);
        if (response) {
          set({ contents: [] });
          get().getTodoList(0);
        }
      } catch (error) {
        console.error(error);
      }
    },
    getTodoList: async (page) => {
      try {
        const response: any = await todoInstance.request<any>({
          url: 'todo',
          params: { page, size: 20 },
        });

        let newContents: any = [];
        newContents = get().contents?.concat(response.data.contents);

        set({ todoList: response.data });
        set({ contents: newContents });
      } catch (error) {
        console.error(error);
      }
    },

    addTask: async (todo) => {
      try {
        await todoInstance.post('todo', todo);
        set({ contents: [] });
        get().getTodoList(0);
      } catch (error) {
        console.error(error);
      }
    },
    deleteTask: async (todoId) => {
      try {
        await todoInstance.delete(`/todo/${todoId}`);
        set({ contents: [] });
        get().getTodoList(0);
      } catch (error) {
        console.error(error);
      }
    },
  }))
);

export const useModalStore = create<ModalState>((set, get) => ({
  title: '',
  open: false,
  setOpen: () => set((state) => ({ open: !state.open })),
  handleOk: () => set({ open: false }),
  confirmLoading: false,
  handleCancel: () => set({ open: false }),
  modalText: '',
}));

export const usePageStore = create<pageState>((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
}));
