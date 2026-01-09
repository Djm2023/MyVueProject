<template>
  <div
    class="meeting-type-card"
    :class="[selected ? 'meeting-type-card-selected' : 'meeting-type-card-default', bgColor]"
    @click="handleSelect"
  >
    <!-- Radio -->
    <div class="meeting-type-radio-wrapper">
      <div class="meeting-type-radio-outer" :class="{ 'meeting-type-radio-selected': selected }">
        <div v-if="selected" class="meeting-type-radio-inner"></div>
      </div>
    </div>

    <!-- Icon -->
    <div class="meeting-type-icon-box">
      <component :is="type.icon" class="meeting-type-icon" />
    </div>

    <!-- Title -->
    <h3 class="meeting-type-title">
      {{ type.title }}
    </h3>
  </div>
</template>

<script>
  import "../../assets/styles/MeetingCard.css"
export default {
  name: "MeetingTypeCard",

  props: {
    type: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: ""
    }
  },

  methods: {
    handleSelect() {
      this.$emit("select", this.type.id); // Vue 2 event emission
    }
  }
};
</script>


