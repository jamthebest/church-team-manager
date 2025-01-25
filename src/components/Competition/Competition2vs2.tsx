import { Controller, useFormContext } from 'react-hook-form';
import { Team } from '../../types';
import { useMemo } from 'react';
import { Form, InputGroup, InputNumber, InputPicker } from 'rsuite';

export interface Competition2Vs2Props {
    teams: Team[];
    // selectedTeams?: Team[];
    // scores?: number[];
}

const Competition2Vs2 = ({ teams }: Competition2Vs2Props) => {
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
            <Form.Group>
                <div className="grid grid-cols-1 sm:grid-rows-3 sm:grid-cols-2 sm:grid-flow-col gap-4">
                    {usedTeams.map((team, index, allTeams) => (
                        <>
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
                                                            allTeams[
                                                                !index ? 1 : 0
                                                            ]?.id
                                                    )
                                                    .map((team) => ({
                                                        label: team.name,
                                                        value: team.id,
                                                    }))}
                                                value={value}
                                                onChange={(val: string) => {
                                                    const team =
                                                        mappedTeams[val];
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
                            {index % 2 === 1 && (
                                <div
                                    key={`${index}-score`}
                                    className="flex items-center space-x-2"
                                >
                                    {usedTeams[
                                        parseInt((index / 2).toString()) * 2
                                    ]?.id && (
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    usedTeams[
                                                        parseInt(
                                                            (
                                                                index / 2
                                                            ).toString()
                                                        ) * 2
                                                    ].color,
                                            }}
                                        ></div>
                                    )}
                                    {usedTeams[
                                        parseInt((index / 2).toString()) * 2 + 1
                                    ]?.id && (
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    usedTeams[
                                                        parseInt(
                                                            (
                                                                index / 2
                                                            ).toString()
                                                        ) *
                                                            2 +
                                                            1
                                                    ].color,
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
                                        name={`scores.${parseInt(
                                            (index / 2).toString()
                                        )}`}
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
                                                                !isNaN(
                                                                    Number(val)
                                                                )
                                                                    ? Number(
                                                                          val
                                                                      )
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
                            )}
                        </>
                    ))}
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

export default Competition2Vs2;
