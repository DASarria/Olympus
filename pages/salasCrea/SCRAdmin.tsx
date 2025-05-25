

import RevsTable from '@/components/RevsTable';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';


const SCRAdmin = () => {
  const router = useRouter();
  const handleClickBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex gap-5 font-bold text-[30px] ml-6">
        <ArrowLeft onClick={handleClickBack} className="cursor-pointer mt-3" />
        <h1>Reservas</h1>
      </div>
      <div>
        <RevsTable />
      </div>
    </div>
  );
};



export default SCRAdmin;
