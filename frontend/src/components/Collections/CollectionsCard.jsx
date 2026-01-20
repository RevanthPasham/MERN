const CollectionsCard = ({ name, imageUrl }) => {
  return (
    <div className="min-w-[120px] sm:min-w-[160px] cursor-pointer text-center">
      <div className="w-full h-[120px] sm:h-[180px] rounded-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 text-sm sm:text-base font-medium">
        {name}
      </p>
    </div>
  );
};

export default CollectionsCard;
