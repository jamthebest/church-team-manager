import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Team } from '../../types';
import { Form, InputGroup, InputNumber, InputPicker } from 'rsuite';

export interface CompetitionIndividualProps {
    teams: Team[];
    // selectedTeams?: Team[];
    // scores?: number[];
}

const CompetitionIndividual = ({ teams }: CompetitionIndividualProps) => {
    const {
        control,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();
    const team: Team = watch(`teams.${0}`);
    const scores: number[] = getValues('scores');

    const mappedTeams = useMemo(() => {
        return teams.reduce((acc, team) => {
            acc[team.id] = team;
            return acc;
        }, {} as Record<string, Team>);
    }, [teams]);

    return (
        <div className="space-y-4">
            <Form.Group>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block mb-1">Equipo:</label>
                        <Controller
                            name={`teams.${0}.id`}
                            control={control}
                            defaultValue={team.id}
                            render={({
                                field: { value, onChange },
                                fieldState: { error },
                            }) => (
                                <Form.Group>
                                    <InputPicker
                                        data={teams.map((team) => ({
                                            label: team.name,
                                            value: team.id,
                                        }))}
                                        value={value}
                                        onChange={(val: string) => {
                                            const team = mappedTeams[val];
                                            if (team) {
                                                onChange(team.id);
                                                setValue(
                                                    `teams.${0}.name`,
                                                    team.name
                                                );
                                                setValue(
                                                    `teams.${0}.color`,
                                                    team.color
                                                );
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
                            )}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-6 h-6 rounded-full"
                            style={{
                                backgroundColor: team.id && team.color || 'gray',
                            }}
                        ></div>
                        <label
                            className="block"
                            style={{
                                maxWidth: 150,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Puntos :
                        </label>
                        <Controller
                            name={`scores.${0}`}
                            control={control}
                            defaultValue={scores[0]}
                            render={({
                                field: { value, onChange },
                                fieldState: { error },
                            }) => (
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Button
                                            disabled={value === 0}
                                            onClick={() => {
                                                onChange(value - 1);
                                            }}
                                        >
                                            -
                                        </InputGroup.Button>
                                        <InputNumber
                                            className={
                                                'custom-input-number'
                                            }
                                            value={value}
                                            min={0}
                                            onChange={(
                                                val: string | number | null
                                            ) => {
                                                onChange(
                                                    !isNaN(Number(val))
                                                        ? Number(val)
                                                        : 0
                                                );
                                            }}
                                        />
                                        <InputGroup.Button
                                            onClick={() => {
                                                onChange(value + 1);
                                            }}
                                        >
                                            +
                                        </InputGroup.Button>
                                    </InputGroup>
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
                </div>
                <Form.ErrorMessage
                    show={errors.scores?.root?.type === 'at-least-one-positive'}
                    placement="bottomStart"
                >
                    {errors.scores?.root?.message as string}
                </Form.ErrorMessage>
            </Form.Group>
        </div>
    );
};

export default CompetitionIndividual;
