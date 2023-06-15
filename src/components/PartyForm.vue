<template>
  <div>
    <Message :msg="msg" :msgClass="msgClass"></Message>
    <form @submit="page === 'newparty' ? createParty($event) : update($event)" id="party-form"
      enctype="multipart/form-data">
      <input type="hidden" v-model="id" name="id" id="id">
      <input type="hidden" v-model="user_id" name="user_id" id="user_id">
      <div class="input-container">
        <label for="title">Titulo do Evento:</label>
        <input type="text" name="title" id="title" v-model="title" placeholder="Digite o título">
      </div>
      <div class="input-container">
        <label for="description">Descrição:</label>
        <textarea name="description" id="description" v-model="description" placeholder="Digite a descrição"></textarea>
      </div>
      <div class="input-container">
        <label for="party_date">Data da Festa:</label>
        <input type="date" name="party_date" id="party_date" v-model="party_date">
      </div>
      <div class="input-container">
        <label for="photos">Imagens:</label>
        <input type="file" multiple="multiple" name="photos" id="photos" ref="file" @change="onChange">
      </div>
      <div v-if="page === 'editparty' && showMiniImages" class="mini-images">
        <p>Imagens atuais:</p>
        <img v-for="(photo, index) in photos" :src="`${photo}`" :key="index">
      </div>
      <div class="input-container checkbox-container">
        <label for="privacy">Evento privado?</label>
        <input type="checkbox" name="privacy" id="privacy" v-model="privacy">
      </div>
      <InputSubmit :text="btnText"></InputSubmit>
    </form>
  </div>
</template>

<script>
import InputSubmit from './form/InputSubmit.vue'
import Message from './Message.vue'

export default {
  name: "PartyForm",
  props: ["party", "page", "btnText"],
  components: {
    InputSubmit,
    Message
  },
  data() {
    return {
      id: this.party._id || null,
      title: this.party.title || null,
      description: this.party.description || null,
      party_date: this.party.partyDate || null,
      photos: this.party.photos || [],
      privacy: this.party.privacy || false,
      user_id: this.party.userId || null,
      msg: null,
      msgClass: null,
      showMiniImages: true
    }
  },
  methods: {
    async createParty(e) {
      e.preventDefault()

      const formData = new FormData()
      formData.append('title', this.title)
      formData.append('description', this.description)
      formData.append('party_date', this.party_date)
      formData.append('privacy', this.privacy)

      if (this.photos.length > 0)
        for (const i of Object.keys(this.photos))
          formData.append('photos', this.photos[i])

      //get token from store
      const token = this.$store.getters.token

      await fetch("http://localhost:3000/api/party", {
        method: "POST",
        headers: {
          "auth-token": token
        },
        body: formData
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

            if (!data.error)
              this.$router.push("dashboard")
          }, 2000);
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async update(e) {
      e.preventDefault()

      const formData = new FormData()
      formData.append('id', this.id)
      formData.append('title', this.title)
      formData.append('description', this.description)
      formData.append('party_date', this.party_date)
      formData.append('privacy', this.privacy)
      formData.append('user_id', this.user_id)

      if (this.photos.length > 0)
        for (const i of Object.keys(this.photos))
          formData.append('photos', this.photos[i])

      //get token from store
      const token = this.$store.getters.token

      await fetch("http://localhost:3000/api/party", {
        method: "PATCH",
        headers: {
          "auth-token": token
        },
        body: formData
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
    },
    onChange(e) {
      this.photos = e.target.files
      this.showMiniImages = false
    }
  }
}
</script>

<style scoped>
#party-form {
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

.input-container input,
.input-container textarea {
  padding: 10px;
  border: 1px solid #e8e8e8;
}

.checkbox-container {
  flex-direction: row;
}

.checkbox-container input {
  margin-left: 12px;
  margin-top: -4px;
}

.mini-images {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0px;
}

.mini-images p {
  width: 100%;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
}

.mini-images img {
  height: 50px;
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>