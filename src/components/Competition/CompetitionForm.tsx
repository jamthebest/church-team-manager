import {
    Controller,
    FormProvider,
    SubmitHandler,
    useFieldArray,
    useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Input, InputPicker } from 'rsuite';
import { Competition, Team } from '../../types';
import { CompetitionSchema } from '../../schemas/Competition';
import Competition1Vs1 from './Competition1Vs1';
import Competition2Vs2 from './Competition2vs2';
import CompetitionAllVsAll from './CompetitionAllVsAll';
import CompetitionIndividual from './CompetitionIndividual';

export type CompetitionInputs = Omit<Competition, 'id'> & { id?: string };

export interface CompetitionFormProps {
    teams: Team[];
    competition?: CompetitionInputs | null;
    onSubmit: SubmitHandler<CompetitionInputs>;
    onDelete: (id: string) => Promise<void>;
}

const CompetitionForm = ({
    teams,
    competition,
    onSubmit,
    onDelete,
}: CompetitionFormProps) => {
    const methods = useForm<CompetitionInputs>({
        resolver: yupResolver(CompetitionSchema),
    });
    const { control, register, handleSubmit, watch } = methods;
    const { replace } = useFieldArray({ name: 'teams', control });
    const { replace: replaceScore } = useFieldArray({
        name: 'scores',
        control,
    } as never);
    const type = watch('type');

    return (
        <FormProvider {...methods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register('id', { value: competition?.id })}
                />
                <div>
                    <label htmlFor="type" className="block mb-1">
                        Tipo de competencia:
                    </label>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: true }}
                        defaultValue={competition?.type}
                        render={({
                            field: { value, onChange },
                            fieldState: { error },
                        }) => {
                            return (
                                <Form.Group>
                                    <InputPicker
                                        data={[
                                            {
                                                label: '1 vs 1',
                                                value: '1 vs 1',
                                            },
                                            {
                                                label: '2 vs 2',
                                                value: '2 vs 2',
                                            },
                                            {
                                                label: 'Todos vs Todos',
                                                value: 'Todos vs Todos',
                                            },
                                            {
                                                label: 'Individual',
                                                value: 'Individual',
                                            },
                                        ]}
                                        value={value}
                                        onChange={(
                                            val: Competition['type']
                                        ) => {
                                            onChange(val);
                                            if (val === '1 vs 1') {
                                                replace([
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                ]);
                                                replaceScore([0, 0]);
                                            } else if (val === '2 vs 2') {
                                                replace([
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                ]);
                                                replaceScore([0, 0]);
                                            } else if (
                                                val === 'Todos vs Todos'
                                            ) {
                                                replace(
                                                    teams.map((team) => ({
                                                        id: team.id,
                                                        name: team.name,
                                                        color: team.color,
                                                    }))
                                                );
                                                replaceScore(
                                                    teams.map(() => 0)
                                                );
                                            } else {
                                                replace([
                                                    {
                                                        id: '',
                                                        name: '',
                                                        color: '#00BCD4',
                                                    },
                                                ]);
                                                replaceScore([0]);
                                            }
                                        }}
                                        block
                                    />
                                    <Form.ErrorMessage
                                        show={!!error}
                                        placement="bottomStart"
                                    >
                                        {error?.message}
                                    </Form.ErrorMessage>
                                </Form.Group>
                            );
                        }}
                    />
                </div>
                <div>
                    {type === '1 vs 1' && (
                        <Competition1Vs1
                            teams={teams}
                            // selectedTeams={competition?.teams}
                            // scores={competition?.scores}
                        />
                    )}
                    {type === '2 vs 2' && (
                        <Competition2Vs2
                            teams={teams}
                            // selectedTeams={competition?.teams}
                            // scores={competition?.scores}
                        />
                    )}
                    {type === 'Todos vs Todos' && <CompetitionAllVsAll />}
                    {type === 'Individual' && (
                        <CompetitionIndividual
                            teams={teams}
                            // selectedTeams={competition?.teams}
                            // scores={competition?.scores}
                        />
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="block mb-1">
                        Descripción:
                    </label>
                    <Controller
                        name="description"
                        control={control}
                        render={({
                            field: { value, onChange },
                            fieldState: { error },
                        }) => (
                            <Form.Group>
                                <Input
                                    as="textarea"
                                    value={value}
                                    onChange={onChange}
                                />
                                <Form.ErrorMessage
                                    show={!!error}
                                    placement="bottomStart"
                                >
                                    {error?.message}
                                </Form.ErrorMessage>
                            </Form.Group>
                        )}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-green-500 text-white rounded"
                >
                    Guardar
                </button>
                {competition?.id && (
                    <button
                        type="button"
                        onClick={() => onDelete(competition.id as string)}
                        className="w-full p-2 bg-red-500 text-white rounded"
                    >
                        Eliminar
                    </button>
                )}
            </form>
        </FormProvider>
    );
};

export default CompetitionForm;
