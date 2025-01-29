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
import Competition1vs1 from './Competition1vs1';
import Competition2vs2 from './Competition2vs2';
import CompetitionAllvsAll from './CompetitionAllvsAll';
import CompetitionIndividual from './CompetitionIndividual';
import { useEffect } from 'react';
import Competition2vs1 from './Competition2vs1';

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
    const { control, register, handleSubmit, setValue, watch } = methods;
    const { replace } = useFieldArray({ name: 'teams', control });
    const { replace: replaceScore } = useFieldArray({
        name: 'scores',
        control,
    } as never);
    const type = watch('type');

    useEffect(() => {
        if (competition) return;
        replace(
            teams.map((team) => ({
                id: team.id,
                name: team.name,
                color: team.color,
            }))
        );
        replaceScore(teams.map(() => 0));
    }, [competition, replace, replaceScore, teams]);

    useEffect(() => {
        if (type === '1 vs 1') {
            replace([
                {
                    id: competition?.teams[0]?.id ?? '',
                    name: competition?.teams[0]?.name ?? '',
                    color: competition?.teams[0]?.color ?? '#00BCD4',
                },
                {
                    id: competition?.teams[1]?.id ?? '',
                    name: competition?.teams[1]?.name ?? '',
                    color: competition?.teams[1]?.color ?? '#00BCD4',
                },
            ]);
            replaceScore(competition?.scores.slice(0, 2) ?? [0, 0]);
        } else if (type === '2 vs 1') {
            replace([
                {
                    id: competition?.teams[0]?.id ?? '',
                    name: competition?.teams[0]?.name ?? '',
                    color: competition?.teams[0]?.color ?? '#00BCD4',
                },
                {
                    id: competition?.teams[1]?.id ?? '',
                    name: competition?.teams[1]?.name ?? '',
                    color: competition?.teams[1]?.color ?? '#00BCD4',
                },
                {
                    id: competition?.teams[2]?.id ?? '',
                    name: competition?.teams[2]?.name ?? '',
                    color: competition?.teams[2]?.color ?? '#00BCD4',
                },
            ]);
            replaceScore(competition?.scores.slice(0, 2) ?? [0, 0]);
        } else if (type === '2 vs 2') {
            replace([
                {
                    id: competition?.teams[0]?.id ?? '',
                    name: competition?.teams[0]?.name ?? '',
                    color: competition?.teams[0]?.color ?? '#00BCD4',
                },
                {
                    id: competition?.teams[1]?.id ?? '',
                    name: competition?.teams[1]?.name ?? '',
                    color: competition?.teams[1]?.color ?? '#00BCD4',
                },
                {
                    id: competition?.teams[2]?.id ?? '',
                    name: competition?.teams[2]?.name ?? '',
                    color: competition?.teams[2]?.color ?? '#00BCD4',
                },
                {
                    id: competition?.teams[3]?.id ?? '',
                    name: competition?.teams[3]?.name ?? '',
                    color: competition?.teams[3]?.color ?? '#00BCD4',
                },
            ]);
            replaceScore(competition?.scores.slice(0, 2) ?? [0, 0]);
        } else if (type === 'Todos vs Todos') {
            replace(
                teams.map((team) => ({
                    id: team.id,
                    name: team.name,
                    color: team.color,
                }))
            );
            replaceScore(
                competition?.scores.slice(0, teams.length) ?? teams.map(() => 0)
            );
        } else {
            replace([
                {
                    id: competition?.teams[0]?.id ?? '',
                    name: competition?.teams[0]?.name ?? '',
                    color: competition?.teams[0]?.color ?? '#00BCD4',
                },
            ]);
            replaceScore(competition?.scores.slice(0, 1) ?? [0]);
        }
        if (competition) {
            setValue('description', competition.description);
        }
    }, [competition, replace, replaceScore, setValue, teams, type]);

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
                        defaultValue={competition?.type ?? 'Todos vs Todos'}
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
                                                label: '2 vs 1',
                                                value: '2 vs 1',
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
                    {type === '1 vs 1' && <Competition1vs1 teams={teams} />}
                    {type === '2 vs 1' && <Competition2vs1 teams={teams} />}
                    {type === '2 vs 2' && <Competition2vs2 teams={teams} />}
                    {type === 'Todos vs Todos' && <CompetitionAllvsAll />}
                    {type === 'Individual' && (
                        <CompetitionIndividual teams={teams} />
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
                <div className="flex justify-end space-x-4">
                    {competition?.id && (
                        <button
                            type="button"
                            onClick={() => onDelete(competition.id as string)}
                            className="p-2 bg-red-500 text-white rounded"
                        >
                            Eliminar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default CompetitionForm;
