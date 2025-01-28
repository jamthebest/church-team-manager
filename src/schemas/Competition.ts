import * as yup from 'yup';
import { Competition } from '../types';
import { AvailableColors } from '../constants';

export const CompetitionSchema = yup.object().shape({
    type: yup
        .mixed<Competition['type']>()
        .oneOf(['1 vs 1', '2 vs 2', 'Todos vs Todos', 'Individual'])
        .required('El tipo de competencia es requerido'),
    teams: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.string().required('El equipo es requerido'),
                name: yup.string().required(),
                color: yup.mixed<AvailableColors>().required(),
            })
        )
        .required('El equipo es requerido'),
    scores: yup
        .array()
        .of(yup.number().required())
        .test(
            'at-least-one-positive',
            'Debe haber al menos un puntaje mayor que 0',
            (numbers) =>
                Array.isArray(numbers) && numbers.some((num) => num > 0)
        )
        .required('El puntaje es requerido'),
    description: yup.string().required('La descripción es requerida'),
});
