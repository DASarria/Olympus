// components/ReservaModal.tsx
import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: (reserva: any) => void;
}

const ReservaModal = ({ onClose, onSubmit }: Props) => {
  const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
  const [reserva, setReserva] = useState({
    userName: '',
    userId: '',
    day: '',
    time: '',
    roomId: '',
    people: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReserva((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const nuevaReserva = {
      userName: reserva.userName,
      userId: reserva.userId,
      role: null, 
      date: {
        day: reserva.day,
        time: reserva.time,
      },
      roomId: reserva.roomId,
      loans: [],
      state: 'RESERVA_CONFIRMADA',
      people: Number(reserva.people),
      
    };
    onSubmit(nuevaReserva);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-xs drop-shadow-xl">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>
        <div className="space-y-3">
          <input name="userName" placeholder="Nombre" onChange={handleChange} className="w-full p-2 border rounded-xl" />
          <input name="userId" placeholder="ID Usuario" onChange={handleChange} className="w-full p-2 border rounded-xl" />
          <input name="day" type="date" onChange={handleChange} className="w-full p-2 border rounded-xl" />
          <input name="time" type="time" onChange={handleChange} className="w-full p-2 border rounded-xl" />
          <input name="roomId" placeholder="Sala" onChange={handleChange} className="w-full p-2 border rounded-xl" />
          <input name="people" type="number" min={1} max={5} value={reserva.people} onChange={handleChange} className="w-full p-2 border rounded-xl" />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="bg-[#990000] px-4 py-2 rounded-xl text-white">Cancelar</button>
          <button onClick={handleSubmit} className="bg-[#990000] text-white px-4 py-2 rounded-xl">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ReservaModal;
