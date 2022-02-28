import { PropertyKeyTypes } from '.';

export const groupBy = <T extends object>(array: T[], getKey: (item: T) => PropertyKeyTypes) =>
  array.reduce((groups, value) => {
    const group = getKey(value);
    if (!groups[group]) groups[group] = [];
    groups[group].push(value);
    return groups;
  }, {} as Record<PropertyKeyTypes, T[]>);

export const groupByKey = <T extends object>(
  //
  array: T[],
  key: keyof T,
) => {
  // eslint-disable-next-line
  return groupBy(array, (e: any) => e[key]);
};
