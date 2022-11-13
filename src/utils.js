const highlightRegex = /(Highlight|标注)/;
const noteRegex = /(Note|笔记)/;
const addRegex = /(Added on|添加于)/;

function labelSplit(label) {
  const labelArr = label.split("|");
  if (labelArr.length === 2) {
      const [pageTypeText, dateText] = labelArr;
      return {
          pageTypeText,
          locationText: '',
          dateText,
      };
  }
  else {
      let [pageTypeText, locationText, dateText] = labelArr;
      return {
          pageTypeText,
          locationText,
          dateText,
      };
  }
}

function labelParser(label) {
  var _a, _b;
  const numberRegex = /[0-9]+/;
  let { pageTypeText, locationText, dateText } = labelSplit(label);
  let type = "Unknown";
  if (highlightRegex.test(pageTypeText)) {
      type = "Highlight";
  }
  if (noteRegex.test(pageTypeText)) {
      type = "Note";
  }
  const page = ((_a = pageTypeText.match(numberRegex)) === null || _a === void 0 ? void 0 : _a[0]) || '';
  const location = ((_b = locationText.match(numberRegex)) === null || _b === void 0 ? void 0 : _b[0]) || '';
  const date = dateText.replace(addRegex, '').trim();
  return {
      type,
      page,
      location,
      date,
  };
}

function lineParser(data) {
  const [bookName, label, _, content] = data;
  return {
      bookName,
      content,
      ...labelParser(label),
  };
}

export function clippingParser(data) {
  const lines = data.split('\n').slice(0, -1);
  const noteArr = [];
  while (lines.length > 0) {
      noteArr.push(lineParser(lines.splice(0, 5).map(el => el.trim())));
  }
  return noteArr;
}

export function download(text, name, type) {
  var a = document.createElement("a");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click()
}
