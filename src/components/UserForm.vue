<template>
  <div>
    <Message :msg="msg" :msgClass="msgClass"></Message>
    <form @submit="page === 'register' ? register($event) : update($event)" id="user-form">
      <input type="hidden" v-model="id" name="id" id="id">
      <div class="input-container">
        <label for="name">Nome:</label>
        <input type="text" name="name" id="name" v-model="name" placeholder="Digite o seu nome">
      </div>
      <div class="input-container">
        <label for="email">Email:</label>
        <input type="text" name="email" id="email" v-model="email" placeholder="Digite o seu email">
      </div>
      <div class="input-container">
        <label for="password">Senha:</label>
        <input type="password" name="password" id="password" v-model="password" placeholder="Digite a sua senha">
      </div>
      <div class="input-container">
        <label for="confirmpassword">Confirmação de Senha:</label>
        <input type="password" name="confirmpassword" id="confirmpassword" v-model="confirmpassword"
          placeholder="Confirme a sua senha">
      </div>
      <InputSubmit :text="btnText"></InputSubmit>
    </form>
  </div>
</template>

<script>
import InputSubmit from './form/InputSubmit.vue'
import Message from './Message.vue'

export default {
  name: "RegisterForm",
  components: {
    InputSubmit,
    Message
  },
  data() {
    return {
      id: this.user._id || null,
      name: this.user.name || null,
      email: this.user.email || null,
      password: null,
      confirmpassword: null,
      msg: null,
      msgClass: null,
    }
  },
  props: ["user", "page", "btnText"],
  methods: {
    async register(e) {
      e.preventDefault()

      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword
      }

      const jsonData = JSON.stringify(data)

      await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: jsonData
      })
        .then((res) => res.json())
        .then((data) => {
          let auth = false;

          if (data.error) {
            this.msg = data.error;
            this.msgClass = "error"
          } else {
            auth = true
            this.msg = data.message;
            this.msgClass = "success"

            //emit event for auth an user
            this.$store.commit("authenticate", { token: data.token, userId: data.userId })
          }

          setTimeout(() => {
            if (!auth)
              this.msg = null
            else
              this.$router.push("dashboard")
          }, 2000);
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async update(e) {
      e.preventDefault()

      const data = {
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword
      }

      const jsonData = JSON.stringify(data)

      const token = this.$store.getters.token

      await fetch("http://localhost:3000/api/user", {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          "auth-token": token
        },
        body: jsonData
      })
        .then((res) => res.json())
        .then((data) => {

          if (data.error) {
            this.msg = data.error;
            this.msgClass = "error"
          } else {
            this.msg = data.message;
            this.msgClass = "success"
          }

          setTimeout(() => {
            this.msg = null
          }, 2000);
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
#user-form {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  text-align: left;
}

.input-container label {
  margin-bottom: 10px;
  color: #555
}

.input-container input {
  padding: 10px;
  border: 1px solid #e8e8e8;
}
</style>