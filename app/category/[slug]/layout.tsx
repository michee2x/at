import React from 'react'

const CategoryLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='w-full min-h-screen bg-gray-200'><h1>this is the cat page</h1>{children}</div>;
};

export default CategoryLayout