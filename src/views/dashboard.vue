<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>上传图片</span>
            </div>
          </template>
          <div class="info">
            <el-upload
              v-model:file-list="fileList"
              action="http://localhost:3000/upload"
              :data="userInfo.data"
              list-type="picture-card"
              :before-upload="checkImageSize"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="hadlePicturesChange"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
            <div class="buttom">
              <el-button type="primary" @click="clearFileList"
                >清空全部</el-button
              >
              <el-button type="primary" @click="startAnalyse"
                >开始分析</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>结果展示</span>
            </div>
          </template>
          <div class="result">
            <el-table :data="pagedData" height="320">
              <el-table-column type="index" label="序号" width="180" />
              <el-table-column label="图片(可查看大图)" align="center">
                <template #default="tableData">
                  <el-image
                    class="table-td-thumb"
                    :src="tableData.row.url"
                    :z-index="10"
                    :preview-src-list="[tableData.row.url]"
                    preview-teleported
                  >
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column prop="result" label="识别结果" width="180" />
              <el-table-column prop="acc" label="准确度" :formatter="Percent" />
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="user">
import { ref, computed, reactive } from "vue";
import "cropperjs/dist/cropper.css";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

import type { UploadProps, UploadUserFile } from "element-plus";
import axios from "axios";

const fileList = ref<UploadUserFile[]>([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const tableData = ref([]);

const userInfo = ref({
  data: {
    userId: localStorage.getItem("ms_username"),
  },
});

// 分页导航
const currentPage = ref(1); // 当前页数
const pageSize = ref(10); // 每页条数

// 获取分页后的数据
const pagedData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return tableData.value.slice(startIndex, endIndex);
});

const total = computed(() => tableData.value.length); // 总数据条数

// 分页大小改变
const handleSizeChange = (val: any) => {
  pageSize.value = val;
  currentPage.value = 1;
};

// 当前页数改变
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

// 检查图片分辨率
const checkImageSize = (file: any) => {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.src = window.URL.createObjectURL(file);

    image.onload = () => {
      const maxWidth = 800; // 允许的最大宽度
      const maxHeight = 600; // 允许的最大高度

      if (image.width <= maxWidth && image.height <= maxHeight) {
        resolve();
      } else {
        ElMessage.error(
          `图片尺寸超出限制，最大允许尺寸为 ${maxWidth} x ${maxHeight}`
        );
        reject();
      }
    };

    image.onerror = () => {
      ElMessage.error("无法读取图片信息");
      reject();
    };
  });
};
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const hadlePicturesChange: UploadProps["onSuccess"] = () => {
  console.log(fileList.value);
};

const clearFileList = () => {
  fileList.value = [];
};

// 格式化数据
const Percent = (row: any) => {
  return "" + Number((row.acc * 100).toFixed(2)) + "%";
};

/** fileList格式如下：
 *  [
  {
    name: '简历.jpg',
    percentage: 100,
    status: 'success',
    size: 1455023,
    raw: { uid: 1694430072311 },
    uid: 1694430072311,
    url: 'blob:http://127.0.0.1:8081/392e508f-de04-4807-80d0-0740abebc40c',
    response: '文件上传成功'
  }
]
 */
const startAnalyse = () => {
  if (fileList.value.length == 0) {
    ElMessage.warning("请先上传图片");
    return;
  }
  const requestData = {
    userId: localStorage.getItem("ms_username"),
    fileList: fileList.value,
  };
  axios({
    method: "post",
    url: "http://localhost:3000/api/data-analyse",
    data: requestData,
  }).then((e) => {
    fileList.value = [];
    tableData.value = e.data.result;
  });
};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
  height: 337px;
  overflow: auto;
  position: relative;
}
.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.info-edit i {
  color: #eee;
  font-size: 25px;
}
.info-image:hover .info-edit {
  opacity: 1;
}
.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}
.crop-demo-btn {
  position: relative;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.result {
  height: 330px;
}
.buttom {
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
