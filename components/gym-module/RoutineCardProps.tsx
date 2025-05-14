interface Props {
  routine: any
}

export const RoutineCard = ({ routine }: Props) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="font-semibold mb-2">{routine.title}</h3>
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex justify-between">
          <span className="text-sm">Descripcion:</span>
          <span className="text-sm">{routine.description}</span>
        </div>
      </div>
      <button className="w-full py-1 px-4 bg-blue-400 text-white rounded-lg text-sm">
        Ver rutina
      </button>
    </div>
  );
};