import { useState } from "react";
import { Input, Button } from "antd";

type PriceFilterProps = {
  onFilter: (min: number, max: number) => void;
};

const PriceFilter = ({ onFilter }: PriceFilterProps) => {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const handleFilterClick = () => {
    onFilter(minPrice, maxPrice);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow flex items-center space-x-4">
      <div>
        <label className="font-semibold text-gray-700 dark:text-gray-400">Giá tối thiểu:</label>
        <Input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="Tối thiểu"
          className="mt-2"
        />
      </div>
      <div>
        <label className="font-semibold text-gray-700 dark:text-gray-400">Giá tối đa:</label>
        <Input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          placeholder="Tối đa"
          className="mt-2"
        />
      </div>
      <Button type="primary" onClick={handleFilterClick}>
        Lọc sản phẩm
      </Button>
    </div>
  );
};

export default PriceFilter;
