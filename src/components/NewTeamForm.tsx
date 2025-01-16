import Circle from '@uiw/react-color-circle';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { AvailableColors, defaultColors } from '../constants';

export type Inputs = {
    id?: string;
    name: string;
    color: AvailableColors;
};

export interface NewTeamFormProps {
    team?: Inputs | null;
    onSubmit: SubmitHandler<Inputs>;
    onDelete: (id: string) => Promise<void>;
}

const NewTeamForm = ({ team = null, onSubmit, onDelete }: NewTeamFormProps) => {
    const { register, handleSubmit, control } = useForm<Inputs>();

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('id', { value: team?.id })} />
            <div>
                <label htmlFor="nombre" className="block mb-1">
                    Nombre:
                </label>
                <input
                    {...register('name', { required: true, value: team?.name })}
                    type="text"
                    id="nombre"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="color" className="block mb-1">
                    Color:
                </label>
                <Controller
                    name="color"
                    control={control}
                    defaultValue={team?.color}
                    render={({ field: { value, onChange } }) => (
                        <Circle
                            colors={defaultColors}
                            color={value}
                            pointProps={{
                                style: {
                                    marginRight: 20,
                                    height: 20,
                                    width: 20,
                                },
                            }}
                            onChange={(color) => {
                                onChange(
                                    color.hex.toUpperCase() as AvailableColors
                                );
                            }}
                        />
                    )}
                />
            </div>
            <div className="flex justify-end space-x-2">
                {!!team && (
                    <button
                        type="button"
                        onClick={() => onDelete(team.id ?? '')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Eliminar Equipo
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {!team ? 'Agregar Equipo' : 'Actualizar Equipo'}
                </button>
            </div>
        </form>
    );
};

export default NewTeamForm;
