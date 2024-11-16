"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { capitalize } from "@/lib/utils";
import { SearchIcon } from "../cTabel/SearchIcon";
import { ChevronDownIcon } from "../cTabel/chevronDownIcon";
import { PlusIcon } from "../cTabel/plusIcon";
import { ErrorCodeType } from "@/utils/supabase/scpay"; // エラーコードの型をインポート
import { getScPayAlldata } from "@/utils/supabase/scpay/req";

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Timeout", uid: "timeout" },
  { name: "Ban", uid: "ban" },
  { name: "Error", uid: "error" }, // エラーをステータスに追加
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  timeout: "warning",
  ban: "danger",
  error: "danger",
};

// Column configuration for error codes
const columns = [
  { name: "エラーコード", uid: "code", sortable: true },
  { name: "エラーメッセージ", uid: "message", sortable: true },
  { name: "カテゴリ", uid: "category" },
  { name: "詳細説明", uid: "description", sortable: true },
  { name: "ステータスコード", uid: "status_code", sortable: true },
  { name: "作成日時", uid: "created_at" },
  { name: "更新日時", uid: "updated_at" },
];

const INITIAL_VISIBLE_COLUMNS = ["code", "message", "category", "created_at"];

export default function ErrorCodeTable() {
  const [data, setErrorCodes] = useState<ErrorCodeType[]>([]); // データの型をErrorCodeTypeに変更
  type Data = (typeof data)[0];
  const [loading, setLoading] = useState<boolean>(true);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "code",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredErrorCodes = Array.isArray(data) ? [...data] : []; // Ensure data is iterable

    if (hasSearchFilter) {
      filteredErrorCodes = filteredErrorCodes.filter((errorCode) =>
        errorCode.message.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredErrorCodes = filteredErrorCodes.filter((errorCode) =>
        Array.from(statusFilter).includes(errorCode.status_code)
      );
    }

    return filteredErrorCodes;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Data, b: Data) => {
      const first = a[sortDescriptor.column as keyof Data] as number;
      const second = b[sortDescriptor.column as keyof Data] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (errorCode: ErrorCodeType, columnKey: React.Key) => {
      const cellValue = errorCode[columnKey as keyof ErrorCodeType];

      switch (columnKey) {
        case "status_code":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[errorCode.status_code ?? ""]}
              size="sm"
              variant="flat"
            >
              {cellValue ?? "unknown"}
            </Chip>
          );
        case "created_at":
          // Format Date to string before returning it
          return new Date(errorCode.created_at).toLocaleDateString(); // Example formatting
        case "updated_at":
          // Format Date to string before returning it
          return new Date(errorCode.updated_at).toLocaleDateString(); // Example formatting
        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data?.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    data?.length || 0,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  useEffect(() => {
    // APIからエラーコードデータを取得
    const fetchErrorCodes = async () => {
      setLoading(true);
      try {
        const response = await getScPayAlldata("error_codes")
        if (!response.ok) {
          throw new Error("Failed to fetch error codes");
        }
        const res_data: ErrorCodeType[] = response.data; // データ型を変更
        setErrorCodes(res_data);
      } catch (error) {
        console.error("Error fetching error code data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchErrorCodes();
  }, []);

  return (
    <Table
      aria-label="Error code table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-dvh",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={loading}
        emptyContent={"No error codes found"}
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.code}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
