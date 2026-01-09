<template>
  <div class="schedule-meeting-wrapper">
    <!-- Header -->
    <h1 class="schedule-meeting-title">Schedule Meeting</h1>

    <p class="schedule-meeting-subtitle">
      Please select the type of meeting you would like to arrange from the options below.
    </p>

    <!-- Meeting Types -->
    <div class="schedule-meeting-types">
      <MeetingTypeGrid v-model="selectedMeetingId" />
    </div>

    <!-- Footer -->
    <div class="schedule-meeting-footer">
      <button
        class="schedule-meeting-next-btn"
        :disabled="!selectedMeeting"
        @click="nextStep"
      >
        Next Step →
      </button>
    </div>
  </div>
</template>

<script>
import MeetingTypeGrid from '../components/Meetings/MeetingTypeGrid.vue'
import { meetingTypes } from '../utils/meetingType'
import '../assets/styles/ScheduleMeeting.css'

export default {
  name: "ScheduleMeeting",

  components: {
    MeetingTypeGrid
  },

  data() {
    return {
      selectedMeetingId: null
    }
  },

  computed: {
    selectedMeeting() {
      return meetingTypes.find(m => m.id === this.selectedMeetingId) || null
    }
  },

  methods: {
    nextStep() {
      if (!this.selectedMeeting) return

      switch (this.selectedMeeting.id) {
        case 1:
          this.$router.push('/schedule-meeting/client-consultation')
          break

        case 2:
          this.$router.push('/schedule-meeting/client-meeting')
          break

        case 3:
          this.$router.push('/schedule-meeting/general-meeting')
          break

        default:
          break
      }
    }
  }
}
</script>

 
