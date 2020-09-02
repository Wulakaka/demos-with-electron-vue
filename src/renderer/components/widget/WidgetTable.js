export class WidgetTable {
  constructor (rows, cols) {
    // 存储所有单元格
    this.cells = this.generateCells(rows, cols)
  }

  /**
   * 生成单元格
   * @param rows {number} 行数
   * @param cols {number} 列数
   * @returns {[]}
   */
  generateCells (rows, cols) {
    const cells = []
    for (let row = 0; row < rows; row++) {
      const _row = []
      for (let col = 0; col < cols; col++) {
        _row.push({
          index: `${row}-${row + 1}_${col}-${col + 1}`,
          width: 100,
          height: 30
          // colspan: 1,
          // rowspan: 1
        })
      }
      cells.push(_row)
    }
    return cells
  }
}
