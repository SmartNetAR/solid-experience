import * as queryString from 'querystring';
import { ParsedUrlQuery } from 'querystring';

interface IFilter
{
    search: string;
    filterBy: string;
    orderBy: string;
    sort: 'asc' | 'desc';
}
interface ISecondFilter
{
    search: string;
    filterBy: string;
}

class FilterFactory
{
    static getUriParam ( filter: IFilter ): string
    {
        const { search, filterBy, orderBy, sort } = filter;
        const order =  orderBy.length <= 0 ? filterBy : orderBy;

        return `filter[${filterBy}]=${search}&sort[${order}]=${sort}`;
    }

    static getUriParamCustom ( filter: IFilter, secondFilter: ISecondFilter | null = null ): string
    {
        const { search, filterBy, orderBy, sort } = filter;
        const order =  orderBy.length <= 0 ? null : orderBy;

        const querySort = order ? `&sort[${order}]=${sort}` : '';

        const optionalFilter = secondFilter ? `&filter[${secondFilter.filterBy}]=${secondFilter.search}` : '';

        return `filter[${filterBy}]=${search}${optionalFilter}${querySort}`;
    }

    static getPath ( userFilterQueryParam: ParsedUrlQuery, nextQueryParamsPagination: string ): string
    {
        const filterSort = userFilterQueryParam ? queryString.stringify( userFilterQueryParam ) : '';

        return filterSort && nextQueryParamsPagination && !nextQueryParamsPagination.includes( filterSort )
            ? `${nextQueryParamsPagination}&${filterSort}`
            : nextQueryParamsPagination;
    }
}

export default FilterFactory;
