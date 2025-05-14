import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ReservaModal from './ReservaModal';
import ReservaExpandida from './ReservaExpandida';
import React from 'react';

interface Reserva {
  id: string;
  userName: string;
  userId: string;
  role: string;
  date: {
    day: string;
    time: string;
  };
  roomId: string;
  loans: string[];
  state: string;
  people: number;
}

interface RevsTableProps {
  reservas: Reserva[];
}

const RevsTable = () => {
  const token = sessionStorage.getItem('token');
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReservaId, setEditingReservaId] = useState<string | null>(null);
  const [hiddenRows, setHiddenRows] = useState<{ [key: string]: boolean }>({}); 

  const fetchReservas = async () => {
    try {
      const response = await fetch(`${url}/revs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error cargando datos');
      }
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleAddReserva = async (nueva: Reserva) => {
    await fetch(`${url}/revs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nueva),
    });
    fetchReservas();
  };

  const handleUpdateReserva = async (updatedReserva: Reserva) => {
    try {
      const response = await fetch(`${url}/revs/${updatedReserva.id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReserva),
      });
      if (!response.ok) {
        throw new Error('Error actualizando reserva');
      }
      fetchReservas();
    } catch (error) {
      console.error('Error FATAL actualizando reserva:', error);
    }  
  }

  return (
    <div className="flex justify-center mt-6">
      {showModal && (
        <ReservaModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddReserva}
        />
      )}
      <section className="bg-[#EAEAEA] p-4 rounded-2xl shadow-md w-[80vw]">
        <div className="flex justify-between items-center mb-4 ml-4 ">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
            <input
              type="text"
              placeholder="Buscar id"
              className="px-3 py-1 rounded-xl bg-white drop-shadow-xl"
            />
            <input
              type="text"
              placeholder="Buscar Nombre"
              className="px-3 py-1 rounded-xl bg-white drop-shadow-xl"
            />
            <input
              type="text"
              placeholder="Sala"
              className="px-3 py-1 rounded-xl bg-white drop-shadow-xl"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white rounded-xl p-2 drop-shadow-xl">
            <Plus className="text-red-500 w-5 h-5" />
          </button>
        </div>

        <div className='max-h-[500px] overflow-y-auto'>
          <table className="w-full text-center border-separate border-spacing-y-3 border-spacing-x-3 drop-shadow-xl">
          <thead>
            <tr className="text-sm font-semibold drop-shadow-xl">
              <th className="bg-white rounded-xl px-4 py-2">Nombre</th>
              <th className="bg-white rounded-xl px-4 py-2">Identificación</th>
              <th className="bg-white rounded-xl px-4 py-2">Fecha</th>
              <th className="bg-white rounded-xl px-4 py-2">Hora</th>
              <th className="bg-white rounded-xl px-4 py-2">Sala</th>
            </tr>
          </thead>
          <tbody>
            {reservas?.map((reserva) => (
              <React.Fragment key={reserva.id}>
                {!hiddenRows[reserva.id] && (
                  <tr
                    key={reserva.id}
                    className="bg-white rounded-xl hover:bg-[#990000] hover:text-white drop-shadow-xl"
                  >
                    <td className="px-4 py-2 rounded-xl">{reserva.userName}</td>
                    <td className="px-4 py-2 rounded-xl">{reserva.userId}</td>
                    <td className="px-4 py-2 rounded-xl">{reserva.date.day}</td>
                    <td className="px-4 py-2 rounded-xl">{reserva.date.time}</td>
                    <td className="px-4 py-2 rounded-xl">{reserva.roomId}</td>
                    <td className="rounded-xl">
                      <button
                        className="px-4 py-1 rounded-full text-sm px-4 py-2 rounded-xl w-full"
                        onClick={() => {
                          setEditingReservaId(reserva.id);
                          setHiddenRows((prev) => ({ ...prev, [reserva.id]: true }));
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )}

                {editingReservaId === reserva.id && (
                  <ReservaExpandida
                    reserva={reserva}
                    onClose={() => {
                      setEditingReservaId(null);
                      setHiddenRows((prev) => ({ ...prev, [reserva.id]: false }));
                    }}
                    onSave={handleUpdateReserva}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
};

export default RevsTable;
