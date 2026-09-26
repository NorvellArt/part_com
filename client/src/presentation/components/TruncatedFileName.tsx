interface TruncatedFileNameProps {
    name: string;
    className?: string;
}

export const TruncatedFileName: React.FC<TruncatedFileNameProps> = ({ name, className = '' }) => {
    const lastDotIndex = name.lastIndexOf('.');
    const fileNameWithoutExt = lastDotIndex !== -1 ? name.substring(0, lastDotIndex) : name;
    const fileExtension = lastDotIndex !== -1 ? name.substring(lastDotIndex) : '';

    return (
        <div className={`grid grid-cols-[minmax(0,1fr)_auto] items-center max-w-full ${className}`}>
            <span className="truncate">{fileNameWithoutExt}</span>
            <span className="shrink-0">{fileExtension}</span>
        </div>
    );
};
