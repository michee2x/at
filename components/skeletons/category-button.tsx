import React from 'react'

const CategoryButton = () => {
  return (
    <>
      {
        [1,2,3,4,5,6,7,8].map(e => {
            return (
              <div
                key={e}
                className={`px-10 lg:px-16 skeleton flex-nowrap flex items-center justify-center py-[12px] lg:py-[16px] border-[1px] border-gray-300 rounded-[24px] h-[18px] lg:h-[39px] `}
              >
              </div>
            );
        })
      }
    </>
  );
}

export default CategoryButton