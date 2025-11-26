export const toNumber = (price: string | number): number => {
      return typeof price === 'string' ? parseFloat(price) : price;
    }