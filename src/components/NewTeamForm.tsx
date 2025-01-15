import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Circle from '@uiw/react-color-circle';
import { defaultColors } from '../constants';

export type Inputs = {
    name: string;
    color: string;
};

const NewTeamForm = ({ onSubmit }: { onSubmit: SubmitHandler<Inputs> }) => {
    const { register, handleSubmit, control } = useForm<Inputs>();

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold">Agregar Equipo</h2>
            <div>
                <label htmlFor="nombre" className="block mb-1">
                    Nombre:
                </label>
                <input
                    {...register('name', { required: true })}
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
                                onChange(color.hex);
                            }}
                        />
                    )}
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Agregar Equipo
            </button>
        </form>
    );
};

export default NewTeamForm;
