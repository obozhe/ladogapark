'use client';

import dayjs from 'dayjs';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import { UnitTemporaryClosure } from '@prisma/client';
import { DialogNames } from 'containers/StateContext';
import IsActiveField from 'components/ManagementPage/IsActiveField';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import { DateFormats } from 'core/enums/DateFormats';
import { formatDate } from 'core/helpers/date';
import { ObjectUnitWithClosedDates } from 'server/objects/units/types';
import BlockLoader from 'ui/BlockLoader';
import Button from 'ui/Button';
import Card from 'ui/Card';
import Menu from 'ui/Menu';
import Tooltip from 'ui/Tooltip';

const getUnits = (url: string) => axios.get<ObjectUnitWithClosedDates[]>(url);

type Props = { objectEntryId: string };

const temporaryClosedCrossing = (temporaryClosures: UnitTemporaryClosure[]) => {
  const today = dayjs();
  const crossingClosure = temporaryClosures.find(({ start, end }) => {
    return dayjs(start).isBefore(today) && dayjs(end).isAfter(today);
  });

  return crossingClosure;
};

export default function UnitsCard({ objectEntryId }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);

  const { open } = useStateContext();

  const {
    data: units = [],
    isLoading,
    isValidating,
    mutate,
  } = useSWR(`/management/objects/units?objectEntryId=${objectEntryId}`, getUnits);

  const deleteTemporaryClosure = (id: string) => {
    const onSubmit = async () => {
      setIsUpdating(true);
      await axios.delete('/management/objects/units/temporary-closure', { data: { id } });
      setIsUpdating(false);

      mutate();
    };

    open(DialogNames.ConfirmationDialog, {
      onSubmit,
      submitLabel: 'Удалить',
      message: `Вы точно хотите удалить временное закрытие?`,
    });
  };

  const toggleIsActiveUnit = async (unitId: string, isActive: boolean, temporaryClosed?: UnitTemporaryClosure) => {
    if (temporaryClosed) {
      deleteTemporaryClosure(temporaryClosed.id);
      isActive = false;
    }

    setIsUpdating(true);
    await axios.post(`/management/objects/units/${unitId}`, { isActive: !isActive });
    setIsUpdating(false);

    const index = units.findIndex((unit) => unit.id === unitId);
    units[index] = {
      ...units[index],
      isActive: !isActive,
    };
    mutate([...units]);
  };

  const deleteUnit = (unitId: string, unitNumber: string) => {
    const onSubmit = async () => {
      setIsUpdating(true);
      await axios.delete(`/management/objects/units/${unitId}`);
      setIsUpdating(false);

      const unitsFiltered = units.filter((unit) => unit.id !== unitId);
      mutate(unitsFiltered);
    };

    open(DialogNames.ConfirmationDialog, {
      onSubmit,
      submitLabel: 'Удалить',
      message: `Вы точно хотите удалить юнит "${unitNumber}"?`,
    });
  };

  const openAddNewUnitDialog = () => {
    open(DialogNames.CreateUnit, { onClose: onDialogClose, objectEntryId });
  };

  const openEditUnitNumberDialog = (unitId: string, unitNumber: string) => {
    open(DialogNames.EditUnitNumber, { onClose: onDialogClose, unitId, unitNumber });
  };

  const openTemporaryCloseUnitDialog = (unitId: string, unitNumber: string, closures: UnitTemporaryClosure[]) => {
    open(DialogNames.TemporaryCloseUnit, { onClose: onDialogClose, unitId, unitNumber, closures });
  };

  const onDialogClose = (data?: ObjectUnitWithClosedDates[]) => {
    if (data) {
      mutate(data, { revalidate: false });
    }
  };

  return (
    <Card
      title="Юниты"
      titleComponent={
        <Button isIconButton color="primary" size="xs" onClick={openAddNewUnitDialog}>
          <Plus />
        </Button>
      }
    >
      <div className="flex flex-col gap-1">
        {isLoading || isUpdating || isValidating ? (
          <Skeleton count={3} height={40} />
        ) : !units.length ? (
          <p className="text-gray-500 text-xs">Юнитов цен</p>
        ) : (
          units.map((unit) => {
            const temporaryClosed = temporaryClosedCrossing(unit.temporaryClosures);
            return (
              <div key={unit.number} className="bg-gray-100 rounded">
                <div className="flex items-center justify-between gap-2 p-2">
                  <div className="flex gap-2 place-items-center">
                    <Tooltip
                      id={String(unit.number)}
                      content={temporaryClosed ? 'Временно закрыт' : unit.isActive ? 'Открыт' : 'Закрыт'}
                    >
                      <IsActiveField hideText isActive={unit.isActive && !temporaryClosed} />
                    </Tooltip>
                    <span className="ml-2">{unit.number}</span>
                  </div>

                  {temporaryClosed && <div className="text-error">Временно закрыт</div>}

                  <Menu
                    buttonComponent={
                      <div className="flex place-items-center rounded p-1 text-primary hover:bg-gray-200">
                        <Settings size={20} />
                      </div>
                    }
                    menuItems={[
                      {
                        label: temporaryClosed ? 'Открыть' : unit.isActive ? 'Закрыть' : 'Открыть',
                        onClick: () => toggleIsActiveUnit(unit.id, unit.isActive, temporaryClosed),
                      },
                      {
                        label: ' Временно закрыть',
                        onClick: () => openTemporaryCloseUnitDialog(unit.id, unit.number, unit.temporaryClosures),
                      },
                      {
                        label: 'Изменить номер',
                        onClick: () => openEditUnitNumberDialog(unit.id, unit.number),
                      },
                      {
                        label: 'Удалить',
                        onClick: () => deleteUnit(unit.id, unit.number),
                      },
                    ]}
                  />
                </div>
                {unit.temporaryClosures.length ? (
                  <div className="flex flex-col gap-1 p-1 whitespace-nowrap">
                    {unit.temporaryClosures.map(({ start, end, id }, i) => (
                      <div
                        key={i}
                        className="bg-error bg-opacity-60 text-white rounded px-2 py-1 flex justify-between items-center gap-2"
                      >
                        <span>
                          Закрыт с <b>{formatDate(start, DateFormats.Date)}</b> по{' '}
                          <b>{formatDate(end, DateFormats.Date)}</b>
                        </span>
                        <Button isIconButton size="xxs" color="error" onClick={() => deleteTemporaryClosure(id)}>
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
