<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="name"
            :class="{invalid: $v.name.$dirty && !$v.name.required}"
        >
        <label for="description">{{'Name' | localize}}</label>
        <small
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
        >
          {{'EnterName' | localize}}
        </small>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'EditProfileBtn'| localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {required} from 'vuelidate/lib/validators'

  export default {
  metaInfo() {
    return {
      title: this.$title('ProfileTitle')
    }
  },
  name: 'profile',
  data: () => ({
    name: ''
  }),
  mounted() {
    this.name = this.info.name;
    setTimeout(() => {
      window.M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return
      }
      const formData = {
        name: this.name
      };

      try {
        await this.updateInfo(formData)
      } catch (e) {
        throw `${e}`;
      }
    }
  },
  validations: {
    name: {required}
  },
}
</script>