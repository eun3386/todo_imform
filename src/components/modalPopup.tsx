import { Modal } from 'antd';

interface ModalType {
  title: string;
  open: boolean;
  handleOk: () => void;
  confirmLoading: boolean;
  handleCancel: () => void;
  modalText: string;
}

export const ModalPopup = ({
  title,
  open,
  handleOk,
  confirmLoading,
  handleCancel,
  modalText,
}: ModalType) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <p>{modalText}</p>
    </Modal>
  );
};
