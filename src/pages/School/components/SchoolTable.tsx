import { useEffect, useMemo, useRef, useState, type HTMLProps } from "react";
import { useDebounce } from "use-debounce";
import { Link } from "react-router-dom";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  useDeleteSchoolMutation,
  useGetSchoolMutation,
} from "../../../services/schoolApi";
import AlertDelete from "../../../components/AlertDialog/AlertDelete";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../components/Toast";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  EyeIcon,
  Loader2Icon,
  PenSquareIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";

import type { DataTableGetRequest, School } from "../../../types";
import { transformStringPlus } from "../../../utilities/stringUtils";

function IndeterminateCheckbox({
  isHeader,
  indeterminate,
  ...rest
}: {
  indeterminate?: boolean;
  isHeader?: boolean;
} & HTMLProps<HTMLInputElement>) {
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
      className={`cursor-pointer form-checkbox h-4 w-4 border-2 border-gray-400 rounded bg-gray-50 focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-indigo-600/20 focus:border-indigo-500/50 focus:ring-offset-0 focus:ring-0 block checked:bg-indigo-500 dark:checked:bg-indigo-600 dark:checked:border-indigo-600 dark:checked:hover:bg-indigo-600 dark:checked:hover:border-indigo-600 ${
        isHeader
          ? "dark:bg-gray-500 dark:border-gray-500"
          : "dark:border-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:hover:border-gray-500"
      }`}
      autoComplete="off"
      {...rest}
    />
  );
}

function SchoolTable() {
  const [search, setSearch] = useState("");
  const [limitPage, setLimitPage] = useState(10);
  const [querySearch] = useDebounce(search, 500);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const [isLargeView, setIsLargeView] = useState<boolean>(
    window.innerWidth > 1024
  );

  const [getSchool, { isLoading, isError, data: schools }] =
    useGetSchoolMutation();
  const [deleteSchool, { isLoading: isLoadingDelete }] =
    useDeleteSchoolMutation();
  const school = useMemo(() => schools?.data ?? [], [schools]);
  const schoolPages = schools?.page;
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const headerClass: Record<string, string> = {
    checkboxs: "w-14 text-center",
    row_number: "w-12",
  };

  const fetchSchool = async (credentials: DataTableGetRequest) => {
    try {
      await getSchool(credentials).unwrap();
    } catch (error) {
      showErrorToast("Gagal mengambil data sekolah");
    }
  };

  const openDeleteDialog = (id: string) => {
    setIsOpenDeleteDialog(true);
    setDeleteId(id);
  };
  const closeDeleteDialog = () => {
    setIsOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      const responseDelete = await deleteSchool({ id: deleteId }).unwrap();
      if (responseDelete.success) {
        showSuccessToast("Berhasil menghapus data sekolah");
        fetchSchool({ search: querySearch, limit: limitPage });
      }
    } catch (error) {
      showErrorToast("Gagal menghapus data sekolah");
    }
    setIsOpenDeleteDialog(false);
  };

  const handleSelectedDelete = async (school: School[]) => {
    const schoolId = school[0]._id;
    if (school.length === 1) {
      try {
        const responseDelete = await deleteSchool({ id: schoolId }).unwrap();
        if (responseDelete.success) {
          showSuccessToast("Berhasil menghapus data sekolah");
          fetchSchool({ search: querySearch, limit: limitPage });
        }
      } catch (error) {
        showErrorToast("Gagal menghapus data sekolah");
      }
    } else {
      showWarningToast("Maaf, fitur ini belum tersedia");
    }
    table.setRowSelection({});
  };

  const columnHelper = createColumnHelper<School>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.display({
        id: "checkboxs",
        header: ({ table }) => (
          <IndeterminateCheckbox
            isHeader
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
        cell: (info) => {
          if (schoolPages) {
            const orderedNumber =
              (schoolPages?.currentPage - 1) * schoolPages?.perPage +
              info?.row?.index +
              1;
            return orderedNumber;
          } else {
            return info.row.index + 1;
          }
        },
      }),
      columnHelper.accessor("name", {
        header: "Nama Sekolah",
        cell: (info) => (
          <div className="flex items-center">
            <div>
              <figure className="mr-3 size-6 rounded-full block overflow-hidden">
                <img
                  src={
                    info?.row?.original?.images[0]?.fileLink ??
                    `https://ui-avatars.com/api/?name=${transformStringPlus(
                      info.getValue()
                    )}&background=6d5Acd&color=fff`
                  }
                  alt={`${info?.getValue()} Profile`}
                  className="w-full h-full object-cover object-center block"
                />
              </figure>
            </div>
            <p className="pr-3">{info?.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor("adminsCount", {
        header: "Admin",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("studentsCount", {
        header: "Siswa",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("address", {
        header: "Alamat",
        cell: (info) => info.getValue(),
      }),
      // action edit and delete
      columnHelper.display({
        id: "action",
        header: "",
        cell: (info) => (
          <div className="flex space-x-5 px-2">
            <Link
              className="relative group/tooltip_detail"
              to={`/school/${info.row.original._id}`}
            >
              <EyeIcon
                size={18}
                className="text-violet-500 hover:text-violet-600"
              />
              <div className="absolute -top-0.75 left-1/2 -translate-x-1/2 -translate-y-full bg-gray-800 text-slate-100 dark:bg-gray-950 dark:text-slate-300 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover/tooltip_detail:opacity-100 transition-all-200 pointer-events-none">
                <p className="text-center">Lihat</p>
              </div>
            </Link>
            <Link
              className="relative group/tooltip_edit"
              to={`/school/edit/${info.row.original._id}`}
            >
              <PenSquareIcon
                size={16}
                className="text-sky-500 hover:text-sky-600"
              />
              <div className="absolute -top-0.75 left-1/2 -translate-x-1/2 -translate-y-full bg-gray-800 text-slate-100 dark:bg-gray-950 dark:text-slate-300 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover/tooltip_edit:opacity-100 transition-all-200 pointer-events-none">
                <p className="text-center">Edit</p>
              </div>
            </Link>
            <button
              className="relative group/tooltip_delete"
              onClick={() => openDeleteDialog(info.row.original._id)}
            >
              <Trash2Icon
                size={16}
                className="text-red-500 hover:text-red-600"
              />
              <div className="absolute -top-0.75 left-1/2 -translate-x-1/2 -translate-y-full bg-gray-800 text-slate-100 dark:bg-gray-950 dark:text-slate-300 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover/tooltip_delete:opacity-100 transition-all-200 pointer-events-none">
                <p className="text-center">Hapus</p>
              </div>
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: school,
    columns: defaultColumns,
    state: {
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel<School>(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  const handleResize = () => {
    setIsLargeView(window.innerWidth > 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchSchool({ search: querySearch, limit: limitPage });
  }, [querySearch, limitPage]);

  return (
    <div>
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden dark:border-gray-600">
        <div className="flex space-x-3 my-4 px-5 items-center justify-between">
          <div className="relative w-full">
            <input
              id="searchSchool"
              type="text"
              placeholder="Cari berdasarkan nama..."
              className="w-3/4 pl-10 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500"
              value={search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-0 top-0">
              <SearchIcon size={20} className="text-gray-500" />
            </div>
          </div>
          <div>
            <p className="bg-indigo-400 rounded-md px-1.5 py-1 text-gray-50 text-3.25xs dark:bg-indigo-600 dark:text-gray-100">
              {schoolPages?.currentPage ?? 1}/{schoolPages?.totalPage ?? 1}
            </p>
          </div>
        </div>
        <div className="pb-3 overflow-x-auto">
          <table className="w-full pb-4">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-y border-gray-200 bg-indigo-50/50 dark:border-gray-600 dark:bg-gray-600"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`font-bold text-xs text-gray-500 tracking-wide px-3 py-3 text-left ${
                        headerClass[header.id] ?? ""
                      } dark:text-gray-300`}
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
              {isLoading ? (
                Array.from({
                  length: school.length !== 0 ? school.length : 5,
                }).map((_, index) => (
                  <tr
                    className="animate-pulse-fast border-b border-gray-20 dark:border-gray-600"
                    key={index}
                  >
                    <td className="px-3 py-3.5 text-center">
                      <div className="skeleton-loader skeleton-sm !size-4.5 !rounded mx-auto" />
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <div className="skeleton-loader skeleton-sm w-4/5 mx-auto" />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="skeleton-loader skeleton-sm w-full" />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="skeleton-loader skeleton-sm w-full" />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="skeleton-loader skeleton-sm w-full" />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="skeleton-loader skeleton-sm w-full" />
                    </td>
                    <td className="px-3 py-3.5 w-34">
                      <div className="skeleton-loader skeleton-sm w-full" />
                    </td>
                  </tr>
                ))
              ) : school.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-3 text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data sekolah yang ditemukan.
                    {isError && (
                      <span
                        aria-label="button"
                        className="cursor-pointer text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        onClick={() =>
                          fetchSchool({ search: querySearch, limit: limitPage })
                        }
                      >
                        {" "}
                        Coba lagi.
                      </span>
                    )}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`text-sm px-3 py-3 text-gray-500 dark:text-gray-400 ${
                          headerClass[cell.column.id] ?? ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mb-3 px-5">
          <div className="flex items-center">
            <p className="text-gray-500 mr-3 dark:text-gray-400">Menampilkan</p>
            <div className="relative">
              <select
                id="tableSchool_paginate"
                name="tableSchool_paginate"
                className="bg-gray-50 border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-0 text-gray-600 cursor-pointer pr-7 appearance-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                value={limitPage}
                disabled={isLoading}
                onChange={(e) => setLimitPage(Number(e.target.value))}
              >
                {[10, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <div className="absolute right-1.5 top-1.5 pointer-events-none">
                <label htmlFor="tableSchool_paginate" className="block">
                  <ChevronDownIcon size={20} className="text-gray-500" />
                </label>
              </div>
            </div>
            {/* total data */}
            <p className="text-gray-500 ml-3 dark:text-gray-400">
              dari {schoolPages?.totalData ?? 0} data
            </p>
          </div>
          <div className="flex space-x-3">
            {isLargeView && (
              <button
                className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 transition hover:bg-indigo-600 hover:border-indigo-600 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed dark:bg-indigo-700 dark:border-indigo-700 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
                onClick={() =>
                  fetchSchool({
                    search: querySearch,
                    page: 1,
                    limit: limitPage,
                  })
                }
                disabled={Number(schoolPages?.currentPage) <= 1 || isLoading}
              >
                First
              </button>
            )}
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 transition hover:bg-indigo-600 hover:border-indigo-600 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed dark:bg-indigo-700 dark:border-indigo-700 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
              onClick={() =>
                fetchSchool({
                  search: querySearch,
                  page: Number(schoolPages?.currentPage) - 1,
                  limit: limitPage,
                })
              }
              disabled={Number(schoolPages?.currentPage) <= 1 || isLoading}
            >
              <ArrowLeftIcon size={16} className={isLargeView ? "mr-1" : ""} />
              {isLargeView ? "Previous" : ""}
            </button>
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 transition hover:bg-indigo-600 hover:border-indigo-600 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed dark:bg-indigo-700 dark:border-indigo-700 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
              onClick={() =>
                fetchSchool({
                  search: querySearch,
                  page: Number(schoolPages?.currentPage) + 1,
                  limit: limitPage,
                })
              }
              disabled={
                Number(schoolPages?.currentPage) >=
                  Number(schoolPages?.totalPage) || isLoading
              }
            >
              {isLargeView ? "Next" : ""}
              <ArrowRightIcon size={16} className={isLargeView ? "ml-1" : ""} />
            </button>
            {isLargeView && (
              <button
                className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 transition hover:bg-indigo-600 hover:border-indigo-600 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed dark:bg-indigo-700 dark:border-indigo-700 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
                onClick={() =>
                  fetchSchool({
                    search: querySearch,
                    page: Number(schoolPages?.totalPage),
                    limit: limitPage,
                  })
                }
                disabled={
                  Number(schoolPages?.currentPage) >=
                    Number(schoolPages?.totalPage) || isLoading
                }
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
        <div className="rounded-full px-12 py-4 shadow-lg bg-gray-900 dark:bg-gray-950">
          <div className="flex items-center space-x-4">
            <p className="text-gray-100">
              {Object.keys(rowSelection).length} data terpilih
            </p>
            {/* hapus */}
            <button
              className="px-3 py-1 font-medium rounded-full border border-red-500 flex items-center bg-red-500 text-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={isLoadingDelete}
              onClick={() => {
                const selectedRow = table.getSelectedRowModel().flatRows;
                const selectedRowOriginal = selectedRow.map(
                  (row) => row.original
                );
                handleSelectedDelete(selectedRowOriginal);
              }}
            >
              {isLoadingDelete ? (
                <>
                  <span className="translate-y-px">
                    <Loader2Icon
                      size={18}
                      className="mr-1.5 animate-spin-fast"
                    />
                  </span>
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2Icon size={16} className="mr-1" />
                  Hapus
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* dialog delete */}
      <AlertDelete
        isOpen={isOpenDeleteDialog}
        message="sekolah"
        isLoading={isLoadingDelete}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default SchoolTable;
