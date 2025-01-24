import { useMemo } from 'react';
import { Form, InputGroup, InputNumber, InputPicker } from 'rsuite';
import { Controller, useFormContext } from 'react-hook-form';
import { Team } from '../../types';

export interface Competition1Vs1Props {
    teams: Team[];
    selectedTeams?: Team[];
    scores?: number[];
}

const Competition1Vs1 = ({
    teams,
}: // selectedTeams,
Competition1Vs1Props) => {
    const {
        control,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();
    const usedTeams: Team[] = watch('teams');
    const scores: number[] = getValues('scores');

    const mappedTeams = useMemo(() => {
        return teams.reduce((acc, team) => {
            acc[team.id] = team;
            return acc;
        }, {} as Record<string, Team>);
    }, [teams]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usedTeams.map((team, index, allTeams) => (
                    <div key={index}>
                        <label className="block mb-1">
                            Equipo {index + 1}:
                        </label>
                        <Controller
                            name={`teams.${index}.id`}
                            control={control}
                            defaultValue={team.id}
                            render={({
                                field: { value, onChange },
                                fieldState: { error },
                            }) => (
                                <Form.Group>
                                    <InputPicker
                                        data={teams
                                            .filter(
                                                (team) =>
                                                    team.id !==
                                                    allTeams[!index ? 1 : 0]?.id
                                            )
                                            .map((team) => ({
                                                label: team.name,
                                                value: team.id,
                                            }))}
                                        value={value}
                                        onChange={(val: string) => {
                                            const team = mappedTeams[val];
                                            if (team) {
                                                onChange(team.id);
                                                setValue(
                                                    `teams.${index}.name`,
                                                    team.name
                                                );
                                                setValue(
                                                    `teams.${index}.color`,
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
                ))}
            </div>
            <Form.Group>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {usedTeams.map((team: Team, index) => {
                        return (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                {team?.id && (
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{
                                            backgroundColor: team.color,
                                        }}
                                    ></div>
                                )}
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
                                    name={`scores.${index}`}
                                    control={control}
                                    defaultValue={scores[index]}
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
                                                        val:
                                                            | string
                                                            | number
                                                            | null
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
                        );
                    })}
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

export default Competition1Vs1;
