import { v4 as uuidv4 } from 'uuid'

export class Cell {
  constructor (index, width = 100, height = 30) {
    this.id = uuidv4()
    this.index = index
    this.width = width
    this.height = height
    this.borderColor = '#000000'
    this.color = ''
    this.text = '文本内容'
    this.textAlign = ''
    this.textIndent = 0
    this.fontSize = 0
    this.fontWeight = ''
    this.tableName = ''
    this.className = ''
  }
}
