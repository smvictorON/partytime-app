<template>
  <div class="dashboard">
    <div class="title-container">
      <h1>Gerencie seus eventos</h1>
      <router-link to="/newparty" class="btn">Cadastrar Festa</router-link>
    </div>
    <div v-if="parties.length > 0">
      <DataTable :parties="parties" />
    </div>
    <div v-else>
      <p>Você não tem festas cadastradas! <router-link to="/newparty">Clique aqui e cadastre!</router-link></p>
    </div>
  </div>
</template>

<script>
import DataTable from '../components/Datatable.vue'
export default {
  name: "Dashboard",
  components: {
    DataTable
  },
  data() {
    return {
      parties: []
    }
  },
  created() {
    //load user parties
    this.getParties()
  },
  methods: {
    async getParties() {
      const token = this.$store.getters.token

      await fetch("http://localhost:3000/api/party/user", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": token
        }
      })
        .then((res) => res.json())
        .then((data) => {
          this.parties = data.parties
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 50px;
  padding-bottom: 100px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.btn {
  padding: 10px 16px;
  background-color: #25282e;
  color: white;
  text-decoration: none;
  border: none;
  cursor: pointer;
  margin: 5px;
  font-size: 14px;
  transition: .5s;
  border-radius: 5px;
}

.btn:hover {
  background-color: black;
}
</style>