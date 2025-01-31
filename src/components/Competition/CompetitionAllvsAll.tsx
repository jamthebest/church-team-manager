import { Controller, useFormContext } from 'react-hook-form';
import { Team } from '../../types';
import { Form, InputGroup, InputNumber } from 'rsuite';

const CompetitionAllvsAll = () => {
    const {
        control,
        getValues,
        register,
        watch,
        formState: { errors },
    } = useFormContext();
    const usedTeams: Team[] = watch('teams');
    const scores: number[] = getValues('scores');

    if (usedTeams.some((team) => !team.id)) {
        return null;
    }

    return (
        <div className="space-y-4">
            <Form.Group>
                <div className="grid grid-cols-1 gap-4">
                    {usedTeams.map((team, index) => (
                        <div
                            key={team.id}
                            className="flex items-center justify-between space-x-4"
                        >
                            <label className="flex items-center space-x-2">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: team.color }}
                                ></div>
                                <span style={{ minWidth: 100 }}>
                                    {team.name}
                                </span>
                                <input
                                    type="hidden"
                                    {...register('id', { value: team?.id })}
                                />
                            </label>
                            <div className="flex items-center space-x-2">
                                <label>Puntos:</label>
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
                        </div>
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

export default CompetitionAllvsAll;
