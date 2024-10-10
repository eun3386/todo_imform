import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getErrorMsg } from './errorCode';
import { message } from 'antd';

export const extractErrorMsg = (error: any) => {
  if (!error.response) {
    return '서버에 접속할 수 없습니다';
  }
  if (error.response.data.errorCode.message) {
    error.response.data.errorCode.message.forEach((errorMessage: string) => {
      message.error(errorMessage);
    });
  } else {
    message.error(getErrorMsg(error.response.data.errorCode));
  }
};

class AxiosInstanceCreator {
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({ ...config, baseURL: 'https://todo-api.imform.net/api/' });
    this.interceptors();
  }

  interceptors() {
    this.instance.interceptors.request.use((config) => {
      if (!config.headers?.Authorization) {
        const act: { state: { accessToken: string } } = JSON.parse(
          sessionStorage.getItem('access-token-storage' || '') || ''
        );
        if (act) {
          const { accessToken } = act.state;

          config.headers.setAuthorization(`Bearer ${accessToken}`);
          config.headers.setAccept(`application/json`);
        }
      }

      return config;
    });

    this.instance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        throw extractErrorMsg(error);
      }
    );
  }

  create() {
    return this.instance;
  }
}

export default AxiosInstanceCreator;
