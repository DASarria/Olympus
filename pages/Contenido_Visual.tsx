import { useRouter } from 'next/router';
import { useState } from 'react';

const Contenido_Visual = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => router.back()} className="text-xl">←</button>
        <h1 className="text-2xl font-bold">Contenido Visual</h1>
      </div>

    </div>
  );
};

export default Contenido_Visual;
