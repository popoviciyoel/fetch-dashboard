export interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
    longitude: number
    latitude: number
    city: string,
    state: string
}

export interface Filters {
    locationSearch: string
    breeds: string[]
    minAge: number;
    maxAge: number
    field: SortField
    order: SortOrder
}


export interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

export interface Coordinates {
    lat: number;
    lon: number;
}


export interface Match {
    match: string
}


export enum SortField {
    BREED = 'breed',
    NAME = 'name',
    AGE = 'age'

}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}