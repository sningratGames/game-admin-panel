import { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  PenSquareIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import AlertDelete from "../../../components/AlertDialog/AlertDelete";
import { StudentProps } from "../../../types/api";

import studentData from "../../../data/STUDENT_DATA.json";

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="cursor-pointer forms-checkbox"
      {...rest}
    />
  );
}

function StudentsTable() {
  const [filter, setFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isLargeView, setIsLargeView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const data: StudentProps[] = useMemo(
    () => studentData.filter((ele) => ele.role === "user"),
    []
  );
  const headerClass: Record<string, string> = {
    checkboxs: "w-14 text-center",
    row_number: "w-12",
    name: "whitespace-nowrap",
    phoneNumber: "whitespace-nowrap",
  };

  const columnHelper = createColumnHelper<StudentProps>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.display({
        id: "checkboxs",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      }),
      columnHelper.display({
        id: "row_number",
        header: "#",
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("name", {
        header: "Nama Lengkap",
        cell: (info) => (
          <div className="flex items-center">
            <img
              src={info.row.original.images.fileLink}
              alt={`${info.getValue()} Profile`}
              className="mr-3 w-6 h-6 object-cover object-center rounded-full"
            />
            <p className="pr-3">{info.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Telepon",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("school.name", {
        header: "Sekolah",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("school.address", {
        header: "Alamat Sekolah",
        cell: (info) => info.getValue(),
      }),
      // action edit and delete
      columnHelper.display({
        id: "action",
        header: "",
        cell: (info) => (
          <div className="flex space-x-4 px-2">
            <Link className="" to={`/student/edit/${info.row.original._id}`}>
              <PenSquareIcon
                size={16}
                className="text-sky-500 hover:text-sky-600"
              />
            </Link>
            <button
              className=""
              onClick={() => openDeleteDialog(info.row.original._id)}
            >
              <Trash2Icon
                size={16}
                className="text-red-500 hover:text-red-600"
              />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns: defaultColumns,
    state: {
      globalFilter: filter,
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel<StudentProps>(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  const handleResize = () => {
    setIsLargeView(window.innerWidth > 1024);
  };

  const openDeleteDialog = (id: string) => {
    setIsOpenDeleteDialog(true);
    setDeleteId(id);
  };

  const closeDeleteDialog = () => {
    setIsOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    setIsLoadingDelete(true);
    console.log(`delete id:${deleteId}...`);
    setTimeout(() => {
      console.log("delete success");
      setIsLoadingDelete(false);
      setIsOpenDeleteDialog(false);
    }, 3000);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="">
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex space-x-3 my-4 px-5 items-center justify-between">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              className="w-3/4 pl-10 focus:outline-none focus:ring-0"
              value={filter ?? ""}
              onChange={(e) => setFilter(String(e.target.value))}
            />
            <div className="absolute left-0 top-0">
              <SearchIcon size={20} className="text-gray-500" />
            </div>
          </div>
          <div className="">
            <p className="bg-indigo-400 rounded-md px-1.5 py-1 text-gray-50 text-3.25xs">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </p>
          </div>
        </div>
        <div className="pb-3 overflow-x-auto">
          <table className="w-full pb-4">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-y border-gray-200 bg-indigo-50/50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`font-bold text-xs text-gray-500 tracking-wide px-3 py-3 text-left ${
                        headerClass[header.id] ?? ""
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : header.id === "checkboxs"
                              ? "flex justify-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ArrowUpIcon size={16} className="ml-1" />,
                            desc: <ArrowDownIcon size={16} className="ml-1" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`text-sm px-3 py-3 text-gray-500 ${
                        cell.column.id === "score" ? "font-semibold" : ""
                      } ${headerClass[cell.column.id] ?? ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mb-3 px-5">
          <div className="flex items-center">
            <p className="text-gray-500 mr-3">Menampilkan</p>
            <div className="relative">
              <select
                id="tableScore_paginate"
                name="tableScore_paginate"
                className="bg-gray-50 border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-0 text-gray-600 cursor-pointer pr-7 appearance-none"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <div className="absolute right-1.5 top-1.5 pointer-events-none">
                <label htmlFor="tableScore_paginate" className="block">
                  <ChevronDownIcon size={20} className="text-gray-500" />
                </label>
              </div>
            </div>
            {/* total data */}
            <p className="text-gray-500 ml-3">dari {data.length} data</p>
          </div>
          <div className="flex space-x-3">
            {isLargeView && (
              <button
                className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                First
              </button>
            )}
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon size={16} className={isLargeView ? "mr-1" : ""} />
              {isLargeView ? "Previous" : ""}
            </button>
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {isLargeView ? "Next" : ""}
              <ArrowRightIcon size={16} className={isLargeView ? "ml-1" : ""} />
            </button>
            {isLargeView && (
              <button
                className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Last
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className={`fixed transform -translate-x-1/2 left-1/2 transition-all-200 bottom-12 ${
          Object.keys(rowSelection).length > 0
            ? "z-50 opacity-100 scale-100"
            : "-z-10 opacity-0 scale-50"
        }`}
      >
        <div className="rounded-full px-12 py-4 shadow-lg bg-gray-900">
          <div className="flex items-center space-x-4">
            <p className="text-gray-100">
              {Object.keys(rowSelection).length} data terpilih
            </p>
            {/* log */}
            <button
              className="px-3 py-1 font-medium rounded-full border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => console.log("rowSelection", rowSelection)}
            >
              Log
            </button>
            {/* hapus */}
            <button
              className="px-3 py-1 font-medium rounded-full border border-red-500 flex items-center bg-red-500 text-gray-50 disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed"
              onClick={() => {
                const selectedIds = Object.keys(rowSelection);
                const newData = data.filter(
                  (item) => !selectedIds.includes(item._id)
                );
                console.log("newData", newData);
              }}
            >
              <Trash2Icon size={16} className="mr-1" />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* dialog delete */}
      <AlertDelete
        isOpen={isOpenDeleteDialog}
        message="siswa"
        isLoading={isLoadingDelete}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default StudentsTable;
