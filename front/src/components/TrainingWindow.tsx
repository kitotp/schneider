
type Props = {
    accuracy: number
}

const TrainingWindow = ({ accuracy }: Props) => {
    return (
        <div>
            {typeof accuracy === "number" && (
                <div className="mb-8 mt-4 bg-gray-900 border border-green-500 rounded-2xl px-6 py-4 text-center shadow-lg">
                    <p className="text-xs uppercase font-medium text-gray-400">
                        Model trained successfully
                    </p>
                    <p className="text-3xl font-semibold text-green-400 mt-1">
                        {(accuracy * 100).toFixed(2)}%
                    </p>
                    <p className="text-sm text-white font-semibold mt-1">
                        Validation accuracy on uploaded dataset
                    </p>
                </div>
            )}
        </div>
    )
}

export default TrainingWindow