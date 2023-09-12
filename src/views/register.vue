<template>
  <div class="register-wrap">
    <div class="ms-register">
      <div class="ms-title">注册</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="register"
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
            placeholder="输入密码"
            v-model="param.password"
            @keyup.enter="registerPost()"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmedPassword">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model="param.confirmedPassword"
            @keyup.enter="registerPost()"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="register-btn">
          <el-button type="primary" @click="registerPost()">注册</el-button>
        </div>
        <router-link class="register-tips" to="/login">返回登录 ></router-link>
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

interface registerInfo {
  username: string;
  password: string;
  confirmedPassword: string;
}

const router = useRouter();
const param = reactive<registerInfo>({
  username: "",
  password: "",
  confirmedPassword: "",
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
  confirm_password: [
    { required: true, message: "请确认密码", trigger: "blur" },
  ],
};
const permiss = usePermissStore();
const register = ref<FormInstance>();
const registerPost = () => {
  if (param.password !== param.confirmedPassword) {
    ElMessage("密码不一致");
    return false;
  }
  const data = {
    username: param.username,
    password: param.password,
    confirmedPassword: param.confirmedPassword,
  };
  axios({
    method: "post",
    url: "http://113.55.114.60:3000/user/account/register",
    data: qs.stringify(data),
    headers: { "content-type": "application/x-www-form-urlencoded" },
  })
    .then((e) => {
      ElMessage.success("注册成功，请登录");
      router.push("/login");
    })
    .catch((e) => {
      ElMessage.error("注册失败");
      return false;
    });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.register-wrap {
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
.ms-register {
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
.register-btn {
  text-align: center;
}
.register-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.register-tips {
  float: right;
  font-size: 12px;
  line-height: 30px;
  color: #409eff;
}
</style>
