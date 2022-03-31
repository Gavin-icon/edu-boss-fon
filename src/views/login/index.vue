<template>
  <div class="login">
    <el-form
    :model="form"
    :rules="rules"
    ref="form"
    label-width="100px"
    labelPosition="top"
     >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="ifLoginLoading">登录</el-button>
      </el-form-item>
      <el-button type="success">→回到用户端</el-button>
    </el-form>
  </div>
</template>

<script>
// import request from '@/utils/request'
// import qs from 'qs'
//  引入封装好的接口文件
import { login } from '@/services/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 16, message: '请输入正确的密码', trigger: 'blur' }
        ]
      },
      ifLoginLoading: false
    }
  },
  methods: {
    //  登录功能
    // onSubmit () {
    //   this.$refs.form.validate( validate => { console.log(validate) } )
    // }
    async onSubmit () {
      // this.$store.commit('add1', 10)
      // this.$store.commit({
      //   type: 'add',
      //   data1: 100
      // })
      // this.$store.commit('add2', {
      //   count: 5,
      //   delay: 2000
      // })
      // this.$store.commit('add2', {
      //   count: 2,
      //   delay: 1000
      // })
      // this.$store.commit('add2', {
      //   count: 1,
      //   delay: 500
      // })
      // this.$store.dispatch('add3Handle', { count: 5, delay: 2000 })
      // this.$store.dispatch('add3Handle', { count: 2, delay: 1000 })
      // this.$store.dispatch('add3Handle', { count: 1, delay: 500 })

      //  使用 async 与 await
      try {
        //  设置校验
        await this.$refs.form.validate()
        this.ifLoginLoading = true
        //  发送请求
        const { data } = await login(this.form)
        console.log('通过校验', data)
        this.ifLoginLoading = false
        //  响应处理
        if (data.state === 1) {
          this.$router.push({
            name: 'home'
          })
          // this.$router.push('/')
          this.$message.success('登录成功')
          //  登录成功后将用户信息存储到Vuex中
          this.$store.commit('setUser', {
            data: data.content
          })
        } else {
          this.$message.error(data.message)
        }
      } catch (err) {
        console.log('未通过校验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      background-color: #fff;
      padding: 20px;
      width: 300px;
      border-radius: 10px;

      .el-button {
        width: 100%;
      }
    }
  }
</style>
