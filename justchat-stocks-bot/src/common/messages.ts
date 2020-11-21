export default {
  quote: (ticker: string, price: number) =>
    `${ticker.toUpperCase()} is $${price.toFixed(2)} per share`,
  dataNotAvailable: (ticker: string) =>
    `Sorry,  we don't have data for ${ticker.toUpperCase()}`,
  invalidCommand: () =>
    "Sorry, invalid command, try for example: /stock=googl.us",
  invalidStock: () => "Sorry, invalid stock, try for example: googl.us",
  genericError: () => "Sorry, i can't handle your request 🤭",
};
