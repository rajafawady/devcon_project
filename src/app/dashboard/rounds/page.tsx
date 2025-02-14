'use client';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/ui/table/data-table';

import { RoundService } from '@/services/Services';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default function Page(props: pageProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Data from API
  const fetchData = async () => {
    const response = (await RoundService.getRounds()) as any;
    console.log(response);
    setData(response);
  };

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Round' description='Manage round ' />
          <Link
            href='/dashboard/round'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />

        <DataTable
          columns={[
            {
              accessorKey: 'name',
              header: 'NAME'
            },
            {
              accessorKey: 'description',
              header: 'DESCRIPTION'
            },
            {
              accessorKey: 'status',
              header: 'STATUS'
            }
          ]}
          data={data}
          totalItems={data.length}
        />
      </div>
    </PageContainer>
  );
}
