<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a
            href="#"
            @click.prevent="$emit('click')"
        >
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{ date | date('datetime') }}</span>
      </div>

      <div class="valign-wrapper">
        <div class="switch">
          <label>
            English
            <input type="checkbox" v-model="isRuLocale">
            <span class="lever"></span>
            Русский
          </label>
        </div>
        <button @click.prevent="submitHandler" class="lang-btn" type="submit">{{'LangBtn' | localize}}</button>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
              class="dropdown-trigger black-text"
              href="#"
              data-target="dropdown"
              ref="dropdown"
          >
            {{ 'Greeting' | localize }} {{ name }}!
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id='dropdown' class='dropdown-content'>
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>{{ 'ProfileTitle' | localize }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>{{ 'LogoutBtn' | localize }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  data: () => ({
    date: null,
    interval: null,
    dropdown: null,
    isRuLocale: true
  }),
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      await this.$router.push('/login?message=logout')
    },
    ...mapActions(['updateInfo']),
    async submitHandler() {
      try {
        await this.updateInfo({locale: this.isRuLocale ? 'ru-RU' : 'en-US'})
      } catch (e) {
        throw `${e}`;
      }
    }
  },
  computed: {
    ...mapGetters(['info']),
    name() {
      return this.$store.getters.info.name
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.dropdown = window.M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false
    })
    this.isRuLocale = this.info.locale === 'ru-RU'
  },
  beforeDestroy() {
    clearInterval(this.interval)
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
    }
  }
}
</script>

<style scoped>
.lang-btn {
  margin-left: 1rem;
  font-size: 12px;
  border: none;
  outline: none;
  border-radius: 15px;
  padding: 8px 10px;
  background-color: #26a69a;
  color: #fff;
  cursor: pointer;
}
.lang-btn:hover {
  background-color: darkcyan;
}
label {
  color: #000;
}
</style>