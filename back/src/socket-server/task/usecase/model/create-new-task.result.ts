export interface ICreateNewTaskResult {
    event: string;
    task: {
        id: string;
        title: string;
        description: string;
        value?: number;
    }
}
