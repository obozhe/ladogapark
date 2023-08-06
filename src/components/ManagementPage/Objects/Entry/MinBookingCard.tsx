'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Plus, Trash2 } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { ObjectEntry } from '@prisma/client';
import Button from 'ui/Button';
import Card from 'ui/Card';

type Props = { objectEntry: ObjectEntry };

export default function MinBookingCard({ objectEntry }: Props) {
  return (
    <Card
      title="Ограничения бронирований"
      titleComponent={
        <Button isIconButton color="primary" size="xs">
          <Plus />
        </Button>
      }
    >
      <div className="flex flex-col gap-1"></div>
    </Card>
  );
}
