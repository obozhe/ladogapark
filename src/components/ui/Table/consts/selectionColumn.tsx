import { Row, Table } from '@tanstack/react-table';
import Checkbox, { CheckboxStates } from 'ui/Checkbox';

const getSelectionColumn = <TRow extends object>() => ({
  id: 'select',
  size: 20,
  header: ({ table }: { table: Table<TRow> }) => (
    <Checkbox
      onChange={table.getToggleAllRowsSelectedHandler()}
      value={
        table.getIsAllRowsSelected()
          ? CheckboxStates.Checked
          : table.getIsSomeRowsSelected()
          ? CheckboxStates.Indeterminate
          : CheckboxStates.Empty
      }
    />
  ),
  cell: ({ row }: { row: Row<TRow> }) => (
    <Checkbox
      onChange={row.getToggleSelectedHandler()}
      value={
        row.getIsSelected()
          ? CheckboxStates.Checked
          : row.getIsSomeSelected()
          ? CheckboxStates.Indeterminate
          : CheckboxStates.Empty
      }
      isDisabled={!row.getCanSelect()}
    />
  ),
});

export default getSelectionColumn;
