const kindleClipping = require('kindle-clipping')
const path = require('path')
const fs = require('fs')

const data= kindleClipping(path.resolve('./My Clippings.txt')).getMergedJson()

/**
 * Group data by bookName
 * {
    bookName: string,
    content: string,
    type: 'Highlight',
    page: '586',
    location: '',
    date: '2022年9月20日星期二 下午9:37:18'
  }
 */
const res = new Map()
data.forEach(record => {
  const { bookName, date, content, page } = record
  const book = res.get(bookName)
  if (book) {
    book.notes.push({
      date,
      page,
      content
    })
  } else {
    res.set(bookName, {
      notes: [{
        date,
        page,
        content
      }]
    })
  }
})

const output = []

for(let item of res.entries()){
  output.push({
    bookName: item[0],
    notes: item[1].notes
  })
}

// export to separate files.
function getContent(notes) {
  return notes.map(note => `> ${note.content}`).join('\n\n')
}

fs.mkdirSync(path.resolve('./output'), { recursive:true })
output.forEach(item => {
  fs.writeFileSync(path.resolve(`./output/${item.bookName}.md`), getContent(item.notes))
})
