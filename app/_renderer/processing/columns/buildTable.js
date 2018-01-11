export default (columns, values) => {
  console.log('Building full table');
  return values[0].map((x, i) => columns.reduce((acc, curr, j) =>
    ({ ...acc, [curr]: values[j][i] }), {}));
};
