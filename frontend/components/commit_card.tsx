interface CommitCardProps {
    commit: {
        author_name: string;
        commit_description: string;
        repository_name: string;
    };
}

export default function CommitCard({ commit }: CommitCardProps) {
    return (
        <div className="card bg-base-200 shadow-md rounded-lg p-4 max-w-md">
            <div className="flex items-center space-x-3">
                <div className="avatar placeholder">
                    <div className="bg-primary-focus text-primary-content rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {commit.author_name}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{commit.author_name}</h3>
                    <p className="text-sm text-gray-500 italic">Repo: {commit.repository_name}</p>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-gray-700 text-base">{commit.commit_description}</p>
            </div>
        </div>
    );
}
