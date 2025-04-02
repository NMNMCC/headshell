export const ShowError = ({ error }: { error: any }) => {
    return (
        <div class="text-red-600">
            <span class="font-bold">Error: </span>
            {String(error.message ?? error.description ?? error.error ?? error)}
        </div>
    );
};
