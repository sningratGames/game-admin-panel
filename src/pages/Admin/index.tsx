import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import AdminTable from './components/AdminTable';
import Breadcrumb from '../../components/Breadcrumb';
import { useAppDispatch } from '../../app/hooks';
import { setBreadcrumb } from '../../features/breadcrumbSlice';

function Admin() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newBreadcrumb = [
      {
        icon: 'admin',
        label: 'Admin',
        path: '/admin',
      },
    ];
    dispatch(setBreadcrumb(newBreadcrumb));
  }, [dispatch]);

  return (
    <div className="">
      <div className="mb-6">
        <Breadcrumb />
        <div className="flex justify-between">
          <div className="">
            <h5 className="font-semibold text-3xl mb-1.5">Admin</h5>
            <p className="text-gray-500">
              Kelola admin yang dapat mengakses dashboard.
            </p>
          </div>
          <div className="">
            <Link
              type="button"
              className="leading-normal ml-4 inline-flex justify-center rounded-lg border border-transparent bg-violet-600 px-4 py-2.5 text-sm font-medium text-gray-100 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-violet-500 disabled:focus-visible:ring-2 disabled:focus-visible:ring-violet-500 disabled:focus-visible:ring-offset-2"
              to="/admin/add">
              <PlusIcon
                size={20}
                className="mr-1.5 stroke-current"
                strokeWidth={2}
              />
              Tambah Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl">
        <AdminTable />
      </div>
    </div>
  );
}

export default Admin;
