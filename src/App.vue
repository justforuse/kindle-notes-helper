<template>
  <div class="app-container">
    <h1 align="center">Get Kindle Notes</h1>
    <el-upload
      class="upload"
      drag
      accept=".txt"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="(e, $event) => handleChange(e, $event)"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop .txt file here or <em>click to upload</em>
      </div>
      <!-- <template #tip>
        <div class="el-upload__tip">
          Upload the txt file.
        </div>
      </template> -->
    </el-upload>
    <div v-if="list.length" class="record-list">
      <h3>
        Total: {{ list.length }}
        <el-icon class="download-icon" @click="handleDownloadAll"
          ><Download
        /></el-icon>
      </h3>
      <details v-for="(record, i) in list" :key="i" class="record-item">
        <summary>
          <div>
            {{ record.bookName }}
            <el-icon
              class="download-icon"
              @click.stop.prevent="() => handleDownload(i)"
              ><Download
            /></el-icon>
          </div>
        </summary>
        <ol>
          <li v-for="(note, j) in record.notes" :key="j">
            {{ note }}
          </li>
        </ol>
      </details>
    </div>
    <h3 v-else>Notes will be show here.</h3>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElUpload, ElIcon } from 'element-plus'
import { UploadFilled, Download } from '@element-plus/icons-vue'

import { process } from './index'
import { download } from './utils'

export default {
  name: 'App',
  components: {
    ElUpload,
    ElIcon,
    UploadFilled,
    Download,
  },
  setup() {
    const list = ref([])
    const handleChange = (data) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const res = process(e.target.result)
        // console.log(res)
        list.value = res
      }
      reader.readAsText(data.raw)
      return false
    }

    const handleDownloadAll = () => {
      download(JSON.stringify(list.value, null, 2), 'Notes.txt', 'text/plain')
    }

    const handleDownload = (index) => {
      download(
        JSON.stringify(list.value[index].notes, null, 2),
        `${list.value[index].bookName}.txt`,
        'text/plain'
      )
    }
    return {
      list,
      handleChange,
      handleDownload,
      handleDownloadAll,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  // text-align: center;
  width: 600px;
  margin: 0 auto;
}
.upload {
  // width: 600px;
  // margin: 0 auto;
}
.record-list {
  .download-icon {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      background-color: #eee;
    }
  }
}
.record-item {
  border-radius: 4px;
  // border: 1px solid #ccc;
  box-shadow: 0 0 6px 0 #ccc;
  padding: 10px 20px;
  margin: 24px;
  line-height: 1.7;
  summary {
    cursor: pointer;
    div {
      display: inline-flex;
      width: calc(100% - 20px);
      justify-content: space-between;
      align-items: baseline;
    }
  }
  li {
    margin-bottom: .6em;
  }
}
</style>
