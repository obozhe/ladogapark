'use client';

import Dialog from 'ui/Dialog';
import { ObjectUnit, Prisma } from '@prisma/client';
import IsActiveField from 'components/ManagementPage/IsActiveField';
import axios from 'core/axios';
import { Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import BlockLoader from 'ui/BlockLoader';
import Button from 'ui/Button';
import Card from 'ui/Card';
import Menu from 'ui/Menu';
import Tooltip from 'ui/Tooltip';
import Input from 'ui/Input';
import _ from 'lodash';

const getAllUnitsNumbers = (url: string) => axios.get<string[]>(url);

type AddNewUnitDialogProps = {
  objectEntryId: string;
  isOpen: boolean;
  onClose: (unitNumber?: string) => void;
};

const AddNewUnitDialog = ({ isOpen, onClose, objectEntryId }: AddNewUnitDialogProps) => {
  const [inputError, setInputError] = useState('');
  const [inputValue, setInputValue] = useState('');

  const {
    data: unitNumbers = [],
    mutate: loadNumbers,
    isValidating: isLoadingNumbers,
  } = useSWR(`/management/objects/units/numbers`, getAllUnitsNumbers, {
    revalidateOnMount: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadNumbers();
    }
  }, [isOpen, loadNumbers]);

  const onChange = _.debounce((e) => {
    setInputValue(e.target.value);
    setInputError(unitNumbers.includes(e.target.value) ? `Юнит с номером ${e.target.value} уже существует` : '');
  }, 300);

  const createUnit = async () => {
    if (inputValue) {
      await axios.post('/management/objects/units', { objectEntryId, number: inputValue });
      onClose(inputValue);
    }
  };

  return (
    <Dialog
      title="Добавить юнит"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={createUnit}
      submitLabel="Сохранить"
      disabled={!!inputError || !inputValue}
      isLoading={isLoadingNumbers}
    >
      <div className="w-72">
        <Input type="number" label="Номер" onChange={onChange} error={inputError} />
      </div>
    </Dialog>
  );
};

const getUnits = (url: string) => axios.get<ObjectUnit[]>(url);

type Props = { objectEntryId: string };

export default function UnitsCard({ objectEntryId }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: units = [],
    isLoading,
    mutate,
  } = useSWR(`/management/objects/units?objectEntryId=${objectEntryId}`, getUnits);

  const toggleIsActiveUnit = async (unitId: string, isActive: boolean) => {
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

  const onAddNewUnitClose = (unitNumber?: string) => {
    if (unitNumber) {
      mutate();
    }

    setIsAddDialogOpen(false);
  };

  return (
    <>
      <BlockLoader isLoading={isLoading || isUpdating}>
        <Card
          title="Юниты"
          titleComponent={
            <Button isIconButton color="primary" size="xs" onClick={() => setIsAddDialogOpen(true)}>
              <Plus />
            </Button>
          }
        >
          <div className="flex flex-col gap-1">
            {units.map((unit) => (
              <div key={unit.number} className="flex items-center justify-between">
                <div className="flex gap-2 place-items-center">
                  <Tooltip id={String(unit.number)} content={unit.isActive ? 'Открыт' : 'Закрыт'}>
                    <IsActiveField hideText isActive={unit.isActive} />
                  </Tooltip>
                  <span className="ml-2">{unit.number}</span>
                </div>

                <Menu
                  buttonComponent={
                    <div className="flex place-items-center p-1 rounded text-primary hover:bg-gray-200">
                      <Settings size={20} />
                    </div>
                  }
                  menuItems={[
                    {
                      label: unit.isActive ? 'Закрыть' : 'Открыть',
                      onClick: () => {
                        toggleIsActiveUnit(unit.id, unit.isActive);
                      },
                    },
                    {
                      label: ' Временно закрыть',
                      onClick: () => {},
                    },
                    {
                      label: 'Изменить номер',
                      onClick: () => {},
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </Card>
      </BlockLoader>

      <AddNewUnitDialog objectEntryId={objectEntryId} isOpen={isAddDialogOpen} onClose={onAddNewUnitClose} />
    </>
  );
}
