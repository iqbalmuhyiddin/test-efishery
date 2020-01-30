import { Modal } from "antd";

const { confirm } = Modal;

const confirmDelete = ({ onDelete, message }) => {
  const title = message;
  confirm({
    title,
    okText: "Ya",
    okType: "danger",
    cancelText: "Batal",
    onOk() {
      onDelete();
    }
  });
};

export default confirmDelete;
