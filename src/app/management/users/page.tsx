'use client';

import { createColumnHelper } from '@tanstack/react-table';
import axios from 'axios';
import prisma from 'core/prisma';
import useFetch from 'hooks/useFetch';
import { getUsers } from 'server/users/UserCollection';
import { UserDTO } from 'server/users/types';
import useSWR from 'swr';
import Table from 'ui/Table';

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
  const { data } = useSWR('/users', () => axios.get<UserDTO[]>('/api/users').then((res) => res.data));
  return <Table rows={data} columns={columns} />;
}
