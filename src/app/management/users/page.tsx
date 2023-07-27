'use client';

import { createColumnHelper } from '@tanstack/react-table';
import axios from 'axios';
import { UserDTO } from 'server/users/types';
import useSWR from 'swr';
import Table from 'features/Table';

const columnHelper = createColumnHelper<UserDTO>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Имя',
    size: 200,
  }),
  columnHelper.accessor('role', {
    header: 'Роль',
    size: 200,
  }),
  // columnHelper.accessor('firstName', {
  //   header: 'First Name',
  //   size: 120,
  // }),
  // columnHelper.accessor('lastName', {
  //   header: 'Last Name',
  //   size: 120,
  // }),
  // columnHelper.accessor('lastLogin', {
  //   header: 'Last Login',
  //   size: 160,
  //   cell: (info) => formatDate(info.getValue(), DateFormats.Grid),
  // }),
  // columnHelper.accessor('createdAt', {
  //   header: 'Created At',
  //   size: 160,
  //   cell: (info) => formatDate(info.getValue(), DateFormats.Grid),
  // }),
];

export default function UsersPage() {
  const { data } = useSWR('/users', (url) => axios.get<UserDTO[]>(url));
  return <Table rows={data} columns={columns} />;
}
