<template>
  <div class="meeting-type-grid">
    <MeetingCard
      v-for="item in meetingTypes"
      :key="item.id"
      :type="item"
      :bgColor="item.bgColor"
      :selected="value === item.id"
      @select="selectType"
    />
  </div>
</template>

<script>
import MeetingCard from './MeetingCard.vue'
import { meetingTypes } from '@/utils/meetingType'
import "../../assets/styles/MeetingTypeGrid.css"

export default {
  name: "MeetingTypeGrid",

  components: {
    MeetingCard
  },

  // Vue 2 v-model uses prop:value and event:input
  props: {
    value: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      meetingTypes
    }
  },

  methods: {
    selectType(id) {
      this.$emit('input', id) // Vue 2 correct v-model emission
    }
  }
}
</script>


