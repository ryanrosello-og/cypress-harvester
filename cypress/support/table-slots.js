// from https://stackoverflow.com/questions/64017962/read-html-table-with-merged-cells-row-for-row-or-column-for-column
// credit : https://stackoverflow.com/users/4245061/metarmask
export const getTableMatrix = (table) => {
  const slots = [];
  for (const row of table.rows) {
    for (const cell of row.cells) {
      let x = cell.cellIndex,
        y = row.rowIndex;
      while (slots[y] && slots[y][x]) x++;
      for (let dx = 0; dx < cell.colSpan; dx++) {
        for (let dy = 0; dy < cell.rowSpan; dy++) {
          while (y + dy >= slots.length) slots.push([]);
          slots[y + dy][x + dx] = cell;
        }
      }
    }
  }
  return slots;
};

// const slots = getTableMatrix(document.querySelector('#even-more-complex'));

// // Format for snippet console
// console.log(`[
//   ${slots
//     .map((row) => {
//       return JSON.stringify(row.map((cell) => cell.textContent.padEnd(5)));
//     })
//     .join(',\n  ')}
// ]`);
// // For real console
