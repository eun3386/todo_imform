export const getErrorMsg = (errorCode: string) => {
  switch (errorCode) {
    case 'ERROR_CODE_01':
      return '몽고 Object Id Validate 실패';
    case 'ERROR_CODE_02':
      return '이미 가입된 이메일 주소';
    case 'ERROR_CODE_03':
      return '사용자 정보 없음';
    case 'ERROR_CODE_04':
      return '기존 비밀번호 불일치';
    case 'ERROR_CODE_05':
      return 'todo 정보 없음';
    case 'ERROR_CODE_06':
      return '비밀번호 5회 오류로 사용자 정보 잠김';
    case 'ERROR_CODE_07':
      return '로그인 유저와 todo에 저장된 유저 ID 불일치';
    case 'ERROR_SERVER':
      return '지정되지 않은 오류 발생';
    default:
      return errorCode;
  }
};
