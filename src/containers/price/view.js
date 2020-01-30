import React, { useState, useRef } from "react";
import Form from "./form";
import Highlighter from "react-highlight-words";
import useWindowSize from "@rehooks/window-size";

import { Button, Icon, Input, Table } from "antd";
import { formatDate, formatNumber } from "utils";
import { MODE } from "constant";

const View = ({ data, isLoading, reload, onDelete }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isFormOpen, setFormOpen] = useState(false);
  const [id, setID] = useState(null);
  const [mode, setMode] = useState(MODE.CREATE);

  let windowSize = useWindowSize();
  let searchInput = useRef(null);

  const _toggleModal = (id = null, mode = null) => {
    if (typeof id === "string") {
      setID(id);
      setMode(mode);
    } else {
      setID(null);
      setMode(MODE.CREATE);
    }
    setFormOpen(!isFormOpen);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const getTableSize = () => {
    let size = "default";
    if (windowSize.outerWidth < 768) {
      size = "middle";
    }
    if (windowSize.outerWidth < 576) {
      size = "small";
    }

    return size;
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Cari ${title}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Cari
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    }
  });

  const columns = [
    {
      title: "Komoditas",
      dataIndex: "komoditas",
      key: "komoditas"
    },
    {
      title: "Provinsi",
      dataIndex: "area_provinsi",
      key: "area_provinsi",
      sorter: (a, b) => a.area_provinsi.length - b.area_provinsi.length,
      ...getColumnSearchProps("area_provinsi", "Provinsi"),
      render: text =>
        searchedColumn === "area_provinsi" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
    },
    {
      title: "Kota",
      dataIndex: "area_kota",
      key: "area_kota",
      sorter: (a, b) => a.area_kota.length - b.area_kota.length,
      ...getColumnSearchProps("area_kota", "Kota"),
      render: text =>
        searchedColumn === "area_kota" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
    },
    {
      title: "Ukuran",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => a.size - b.size,
      ...getColumnSearchProps("size", "Ukuran"),
      render: text =>
        searchedColumn === "size" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
    },
    {
      title: "Harga",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: text => `Rp. ${formatNumber(text)}`
    },
    {
      title: "Tanggal di buat",
      dataIndex: "tgl_parsed",
      key: "tgl_parsed",
      sorter: (a, b) => a.timestamp - b.timestamp,
      render: text => formatDate(text)
    },
    {
      title: "Aksi",
      key: "action",
      fixed: "right",
      render: item => (
        <React.Fragment>
          <Button
            size="small"
            type="primary"
            className="mr-2 d-inline-flex align-items-center"
            onClick={() => _toggleModal(item.uuid, MODE.VIEW)}
          >
            <Icon type="eye" className="d-lg-none d-md-inline-block" />
            <span className="d-none d-lg-inline-block">Detail</span>
          </Button>
          <Button
            size="small"
            type="primary"
            className="mr-2 d-inline-flex align-items-center"
            onClick={() => _toggleModal(item.uuid, MODE.EDIT)}
          >
            <Icon type="edit" className="d-lg-none d-md-inline-block" />
            <span className="d-none d-lg-inline-block ">Ubah</span>
          </Button>
          <Button
            size="small"
            type="danger"
            className="d-inline-flex align-items-center"
            onClick={() => onDelete(item.uuid)}
          >
            <Icon type="delete" className="d-lg-none d-md-inline-block" />
            <span className="d-none d-lg-inline-block">Hapus</span>
          </Button>
        </React.Fragment>
      )
    }
  ];

  return (
    <React.Fragment>
      {isFormOpen && (
        <Form toggleModal={_toggleModal} reload={reload} id={id} mode={mode} />
      )}
      <div className="container p-4 bg-white rounded shadow">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between mb-3">
              <h3 className="text-dark">Daftar Harga</h3>
              <Button type="primary" onClick={_toggleModal}>
                Tambah Baru
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={data}
              size={getTableSize()}
              rowKey="uuid"
              loading={isLoading}
              scroll={{ x: true }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default View;
