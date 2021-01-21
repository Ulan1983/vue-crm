<template>
  <table>
    <thead>
    <tr>
      <th>#</th>
      <th>{{'TableAmount' | localize}}</th>
      <th>{{ 'TableDate' | localize }}</th>
      <th>{{'TableCategory' | localize}}</th>
      <th>{{'TableType' | localize}}</th>
      <th>{{'TableOpen' | localize}}</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(record, idx) in records" :key="record.id">
      <td>{{idx + 1}}</td>
      <td>{{ record.amount | currency('KGS')}}</td>
      <td>{{ record.date | date('datetime') }}</td>
      <td>{{ record.categoryName }}</td>
      <td>
        <span
            class="white-text badge"
            :class="[record.typeClass]"
        >
          {{record.typeText}}
        </span>
      </td>
      <td>
        <button
            v-tooltip="ShowRecordTooltip('ShowRecordTooltipVal')"
            class="btn-small btn"
            @click="$router.push(`/detail/${record.id}`)"
        >
          <i class="material-icons">open_in_new</i>
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";

export default {
  props: {
    records: {
      required: true,
      type: Array
    }
  },
  methods: {
    ShowRecordTooltip(val) {
      return localizeFilter(val)
    }
  }
}
</script>