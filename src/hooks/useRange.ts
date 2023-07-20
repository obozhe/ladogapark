import { Range, defaultRangeExtractor } from '@tanstack/react-virtual';
import { OptionDto } from 'core/types/optionsDto';
import lodashGroupBy from 'lodash.groupby';
import { useCallback, useRef } from 'react';

export type GroupOption = { value: string; isGroup: boolean };

const useRange = (options: OptionDto[], groupBy?: (option: OptionDto) => string) => {
    let groups: GroupOption[] | null = null;
    let updatedOptions: (OptionDto | GroupOption)[] | OptionDto[] = options;
    let stickyIndexes: number[] | null = null;

    const activeStickyIndexRef = useRef<number | null>(groupBy ? 0 : null);

    if (groupBy) {
        const groupedOptions = lodashGroupBy(options, groupBy);
        groups = Object.keys(groupedOptions).map((groupName) => ({ value: groupName, isGroup: true }));
        updatedOptions = groups.reduce(
            (acc, groupName) => [...acc, groupName, ...groupedOptions[groupName.value]],
            [] as (OptionDto | GroupOption)[]
        );
        stickyIndexes = groups.map((groupName) => updatedOptions.findIndex((n) => n.value === groupName.value));
    }

    const rangeExtractor = useCallback(
        (range: Range) => {
            if (!stickyIndexes) return defaultRangeExtractor(range);

            activeStickyIndexRef.current = [...stickyIndexes].reverse().find((index) => range.startIndex >= index) ?? 0;

            const next = new Set([activeStickyIndexRef.current, ...defaultRangeExtractor(range)]);

            return [...next].sort((a, b) => a - b);
        },
        [stickyIndexes]
    );

    const isSticky = (index: number) => stickyIndexes && stickyIndexes.includes(index);

    const isActiveSticky = (index: number) => activeStickyIndexRef.current === index;

    return {
        updatedOptions,
        rangeExtractor,
        isSticky,
        isActiveSticky,
    };
};

export default useRange;
