import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ResultComponent = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="회원가입이 완료되었습니다."
      extra={
        <Button
          type="primary"
          key="console"
          style={{ backgroundColor: '#1677ff' }}
          onClick={() => navigate('/')}
        >
          로그인
        </Button>
      }
    />
  );
};
