import { TypeAttributes } from 'rsuite/esm/internals/types';

export const defaultColors = [
    '#673AB7',
    '#2196F3',
    '#4CAF50',
    '#F44336',
    '#FFB300',
    '#FA8900',
    '#00BCD4',
];

export type AvailableColors = keyof typeof DefaultColorsMap;

export enum DefaultColorsMap {
    '#673AB7' = 'violet',
    '#2196F3' = 'blue',
    '#4CAF50' = 'green',
    '#F44336' = 'red',
    '#FFB300' = 'yellow',
    '#FA8900' = 'orange',
    '#00BCD4' = 'cyan',
}

export const GetColor = (
    color: AvailableColors
): TypeAttributes.Color | undefined => {
    return DefaultColorsMap[color.toUpperCase() as AvailableColors];
};

export const AvailableCompetitionTypes = [
    '1 vs 1',
    '2 vs 1',
    '2 vs 2',
    'Todos vs Todos',
    'Individual',
] as const;

export type AvailableCompetitionTypes = typeof AvailableCompetitionTypes[number];
