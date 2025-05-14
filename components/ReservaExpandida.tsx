import React, { useState } from 'react';

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

interface Props {
  reserva: Reserva;
  onClose: () => void;
  onSave: (updatedReserva: Reserva) => void; 
}

const ReservaExpandida: React.FC<Props> = ({ reserva, onClose, onSave }) => {
  const [editedReserva, setEditedReserva] = useState<Reserva>(reserva);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedReserva({
      ...editedReserva,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(editedReserva); 
    onClose(); 
  };

  
  const stateOptions = [
    'RESERVA_CONFIRMADA',
    'RESERVA_CANCELADA',
    'RESERVA_TERMINADA',
  ];

  return (
    <tr className="bg-white rounded-xl drop-shadow-xl">
      <td colSpan={6}>
        <div className="bg-white p-4 rounded-xl mt-2 shadow-md">
          <div className="grid grid-cols-3 gap-6"> {/* Ajustamos el espacio entre las columnas */}
            <div className="flex flex-col">
              <label><strong>Nombre:</strong></label>
              <input
                type="text"
                name="userName"
                value={editedReserva.userName}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label><strong>Identificación:</strong></label>
              <input
                type="text"
                name="userId"
                value={editedReserva.userId}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label><strong>Estado:</strong></label>
              <select
                name="state"
                value={editedReserva.state}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              >
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label><strong>Número de personas:</strong></label>
              <input
                type="number"
                name="people"
                value={editedReserva.people}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label><strong>Préstamos:</strong></label>
              <input
                type="text"
                name="loans"
                value={editedReserva.loans.join(', ')}
                onChange={(e) => {
                  const loans = e.target.value.split(',').map((loan) => loan.trim());
                  setEditedReserva({ ...editedReserva, loans });
                }}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label><strong>Fecha:</strong></label>
              <input
                type="date"
                name="date"
                value={`${editedReserva.date.day}`}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <label><strong>Hora:</strong></label>
              <input
                type="time"
                name="time"
                value={`${editedReserva.date.time}`}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <label><strong>Sala:</strong></label>
              <input
                type="text"
                name="roomId"
                value={editedReserva.roomId}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label><strong>Rol:</strong></label>
              <input
                type="text"
                name="role"
                value={editedReserva.role}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-1 text-sm rounded-full bg-[#990000] text-white"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1 text-sm rounded-full bg-[#990000] text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ReservaExpandida;
