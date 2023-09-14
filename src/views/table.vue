<template>
  <div>
    <div class="container">
      <el-table :data="pagedData">
        <el-table-column type="index" label="序号" width="100" />
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
        <el-table-column prop="result" label="识别结果" align="center" />
        <el-table-column
          prop="acc"
          label="准确度"
          :formatter="Percent"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="handleClick(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
    </div>
  </div>
</template>

<script setup lang="ts" name="user">
import { ref, computed } from "vue";
import "cropperjs/dist/cropper.css";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

import type { UploadProps, UploadUserFile } from "element-plus";
import axios from "axios";

const fileList = ref<UploadUserFile[]>([]);

const tableData = ref<any[]>([]);

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

const Percent = (row: any) => {
  return "" + Number((row.acc * 100).toFixed(2)) + "%";
};

// 页面加载时获取列表数据
const fecthData = () => {
  const requestData = {
    userId: localStorage.getItem("ms_username"),
  };
  axios({
    method: "get",
    url: "http://localhost:3000/api/datalist",
    params: requestData,
  }).then((e) => {
    fileList.value = [];
    tableData.value = e.data.result;
  });
};
fecthData();

// 删除某一行数据
const handleClick = (row: any) => {
  const requestData = {
    recordId: row.id,
  };
  axios({
    method: "delete",
    url: "http://localhost:3000/api/delete",
    params: requestData,
  })
    .then((e) => {
      ElMessage.success("删除成功");
      // 删除成功后，从表格中移除对应的行数据
      const index = tableData.value.indexOf(row);
      if (index !== -1) {
        tableData.value.splice(index, 1);
      }
    })
    .catch((e) => {
      ElMessage.warning("删除失败");
    });
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
