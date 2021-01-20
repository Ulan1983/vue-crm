<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <Loader v-if="loading"/>

    <h6 class="center" v-else-if="!records.length">
      Записей пока нет.
      <router-link to="/record">Добавьте запись</router-link>
    </h6>

    <section v-else>
      <HistoryTable :records="records"/>

      <Paginate
          :page-count="20"
          :click-handler="pageChangeHandler"
          :prev-text="'Назад'"
          :next-text="'Вперед'"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
          :margin-pages="3"
        />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";

export default {
  name: 'history',
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
    categories: []
  }),
  async mounted() {
    // this.records = await this.$store.dispatch('fetchRecords')
    const records = await this.$store.dispatch('fetchRecords')
    this.categories = await this.$store.dispatch('fetchCategories')
    this.records = records.map(record => {
      return {
        ...record,
        categoryName: this.categories.find(c => c.id === record.categoryId).title,
        typeClass: record.type === 'income' ? 'green' : 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход',
      }
    })

    this.loading = false;
  },
  methods: {
    pageChangeHandler() {

    }
  },
  components: {
    HistoryTable
  },
}
</script>