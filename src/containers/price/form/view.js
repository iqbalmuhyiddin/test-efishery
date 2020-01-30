import React from "react";
import { Button, Input, InputNumber, Modal } from "antd";
import { Label, SelectArea, SelectSize } from "components";
import { MODE } from "constant";

const { VIEW, EDIT, CREATE } = MODE;

const TITLE = {
  [VIEW]: "Lihat Harga",
  [EDIT]: "Ubah Harga",
  [CREATE]: "Tambah Harga"
};

const Form = ({
  onOk,
  onCancel,
  isLoading,
  data,
  onChange,
  onChangeArea,
  mode
}) => {
  const isView = mode === VIEW;

  const _handleSubmit = e => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    onOk();
  };

  return (
    <Modal
      title={TITLE[mode]}
      visible
      maskClosable={false}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
    >
      <form onSubmit={_handleSubmit}>
        <Label>Komoditas</Label>
        <Input
          placeholder="Masukan Komoditas"
          style={{ width: "100%" }}
          className="mb-3"
          name="name"
          value={data.komoditas}
          disabled
        />

        <Label>Area</Label>
        <SelectArea
          placeholder="Pilih Area"
          disabled={isView}
          style={{ width: "100%" }}
          className="mb-3"
          name="selectedArea"
          value={data.selectedArea}
          onChange={value => onChangeArea(value)}
          required
        />

        <Label>Ukuran</Label>
        <SelectSize
          placeholder="Pilih Ukuran"
          disabled={isView}
          style={{ width: "100%" }}
          className="mb-3"
          name="size"
          value={data.size}
          onChange={value => onChange("size", value)}
          required
        />

        <Label>Harga</Label>
        <InputNumber
          placeholder="Masukan Harga"
          style={{ width: "100%" }}
          type="number"
          className="mb-3"
          name="price"
          value={data.price}
          disabled={isView}
          onChange={value => onChange("price", value)}
        />

        <div className="d-flex justify-content-end mt-2">
          <Button key="back" type="danger" onClick={onCancel} className="mr-2">
            Tutup
          </Button>
          {!isView && (
            <Button
              key="submit"
              type="primary"
              loading={isLoading}
              htmlType="submit"
              className="hs-btn orange"
            >
              Simpan
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default Form;
