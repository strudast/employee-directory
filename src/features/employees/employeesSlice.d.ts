export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    department: string;
    status: boolean;
    hireDate: string;
    notes: string;
}
interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
    search: string;
    departmentFilter: string;
    selectedEmployee: Employee | null;
}
export declare const departments: string[];
export declare const fetchEmployees: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const setSearch: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "employees/setSearch">, setDepartmentFilter: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "employees/setDepartmentFilter">, setSelectedEmployee: import("@reduxjs/toolkit").ActionCreatorWithPayload<Employee | null, "employees/setSelectedEmployee">;
declare const _default: import("redux").Reducer<EmployeesState>;
export default _default;
export declare const selectFilteredEmployees: (state: {
    employees: EmployeesState;
}) => Employee[];
