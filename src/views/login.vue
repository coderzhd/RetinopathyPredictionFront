<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">登录</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="邮箱">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter="loginPost()"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="loginPost()">登录</el-button>
        </div>
        <router-link class="login-tips" to="/register">立即注册 ></router-link>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTagsStore } from "../store/tags";
import { usePermissStore } from "../store/permiss";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import axios from "axios";
import qs from "qs";

interface LoginInfo {
  username: string;
  password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
  username: "",
  password: "",
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const loginPost = () => {
  const data = {
    username: param.username,
    password: param.password,
  };
  axios({
    method: "post",
    url: "http://113.55.114.60:3000/user/account/token",
    data: qs.stringify(data),
    headers: { "content-type": "application/x-www-form-urlencoded" },
  })
    .then((e) => {
      console.log(e.data);
      ElMessage.success("登录成功");
      localStorage.setItem("ms_username", param.username);
      const keys =
        permiss.defaultList[param.username == "admin" ? "admin" : "user"];
      permiss.handleSet(keys);
      localStorage.setItem("ms_keys", JSON.stringify(keys));
      router.push("/");
    })
    .catch((e) => {
      ElMessage.error("登录失败");
      return false;
    });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  float: right;
  font-size: 12px;
  line-height: 30px;
  color: #409eff;
}
</style>
