<template>
  <div class="meeting-schedule-wrapper">
    <div class="meeting-schedule-card">
      <div :class="['meeting-schedule-header', currentMeeting.bgColor]">
        <div class="meeting-schedule-header-icon">
          <component
            :is="currentMeeting.icon"
            class="meeting-schedule-header-icon-color"
          />
        </div>

        <div>
          <h2 class="meeting-schedule-header-title">Meeting Details</h2>
          <p class="meeting-schedule-header-subtitle">
            {{ currentMeeting.title }}
          </p>
        </div>
      </div>

      <div class="meeting-schedule-body">
        <section v-if="isClientMeeting || isGeneralMeeting">
          <div class="title-row">
            <label>Title :</label>
            <input
              type="text"
              v-model="meetTitle"
              :class="[
                'meeting-schedule-input',
                errors.meetTitle ? 'error-input' : '',
              ]"
              placeholder="Enter title"
            />
          </div>
          <p v-if="errors.meetTitle" class="error-text error-title">
            {{ errors.meetTitle }}
          </p>
        </section>

        <section>
          <h3 class="meeting-schedule-section-title">Participants</h3>
          <div class="meeting-schedule-grid-3">
            <div class="field-wrapper">
              <label class="meeting-schedule-label">Choose a client</label>
              <select
                v-model="selectedClient"
                :class="[
                  'meeting-schedule-input',
                  errors.selectedClient ? 'error-input' : '',
                ]"
              >
                <option
                  v-for="lawyer in lawyerList"
                  :key="lawyer.id"
                  :value="lawyer.name"
                >
                  {{ lawyer.id }} - {{ lawyer.name }}
                </option>
              </select>
              <p v-if="errors.selectedClient" class="error-text">
                {{ errors.selectedClient }}
              </p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Choose Lawyer</label>
              <select
                v-model="selectedLawyer"
                :class="[
                  'meeting-schedule-input',
                  errors.selectedLawyer ? 'error-input' : '',
                ]"
              >
                <option
                  v-for="lawyer in lawyerList"
                  :key="lawyer.id"
                  :value="lawyer.name"
                >
                  {{ lawyer.id }} - {{ lawyer.name }}
                </option>
              </select>
              <p v-if="errors.selectedLawyer" class="error-text">
                {{ errors.selectedLawyer }}
              </p>
            </div>

            <div class="field-wrapper">
              <button class="meeting-schedule-button-check-availability">
                Check Availability
              </button>
            </div>
          </div>
        </section>

        <section v-if="isGeneralMeeting">
          <div class="attendee-row">
            <span class="attendee-label">Attendees :</span>
            <span class="attendee-value">
              <span
                v-for="(person, index) in attendeeList"
                :key="index"
                class="attendee-chip-inline"
                :style="{ backgroundColor: attendeeColors[index] }"
              >
                {{ person }}
              </span>
            </span>
          </div>
        </section>

        <section>
          <h3 class="meeting-schedule-section-title">Date & Time</h3>
          <div class="meeting-schedule-grid-3">
            <div class="field-wrapper">
              <label class="meeting-schedule-label">Appointment Date</label>
              <input
                type="date"
                v-model="appointmentDate"
                :class="[
                  'meeting-schedule-input',
                  errors.appointmentDate ? 'error-input' : '',
                ]"
              />
              <p v-if="errors.appointmentDate" class="error-text">
                {{ errors.appointmentDate }}
              </p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Start Time</label>
              <input
                type="time"
                v-model="startTime"
                :class="[
                  'meeting-schedule-input',
                  errors.startTime ? 'error-input' : '',
                ]"
              />
              <p v-if="errors.startTime" class="error-text">
                {{ errors.startTime }}
              </p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">End Time</label>
              <input
                type="time"
                v-model="endTime"
                :class="[
                  'meeting-schedule-input',
                  errors.endTime ? 'error-input' : '',
                ]"
              />
              <p v-if="errors.endTime" class="error-text">
                {{ errors.endTime }}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="meeting-schedule-section-title">Payment Details</h3>
          <div class="meeting-schedule-grid-2">
            <div class="field-wrapper">
              <label class="meeting-schedule-label">Amount</label>
              <input
                type="number"
                v-model="amount"
                :class="[
                  'meeting-schedule-input',
                  errors.amount ? 'error-input' : '',
                ]"
              />
              <p v-if="errors.amount" class="error-text">{{ errors.amount }}</p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Payment Status</label>
              <div class="meeting-schedule-radio-group">
                <label
                  ><input type="radio" value="Paid" v-model="paymentStatus" />
                  Paid</label
                >
                <label
                  ><input
                    type="radio"
                    value="Partial"
                    v-model="paymentStatus"
                  />
                  Partial</label
                >
                <label
                  ><input
                    type="radio"
                    value="Pending"
                    v-model="paymentStatus"
                  />
                  Pending</label
                >
                <label
                  ><input type="radio" value="NA" v-model="paymentStatus" />
                  N/A</label
                >
              </div>
              <p v-if="errors.paymentStatus" class="error-text">
                {{ errors.paymentStatus }}
              </p>
            </div>
          </div>
        </section>

        <div class="meeting-schedule-actions">
          <button class="meeting-schedule-btn-outline" @click="$router.back()">
            Back
          </button>
          <button class="meeting-schedule-btn-primary" @click="goNext">
            Next
          </button>
        </div>
      </div>
    </div>

    <div class="calendar-sidebar">
      <date-picker
        v-model="appointmentDate"
        inline
        type="date"
        value-type="format"
        format="YYYY-MM-DD"
        :disabled-date="disableBlockedDates"
      ></date-picker>

      <!-- <p
        v-if="errors.appointmentDate"
        class="error-text"
        style="text-align: center; margin-top: 10px"
      >
        {{ errors.appointmentDate }}
      </p> -->
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { meetingTypes } from "../utils/meetingType";
import { getRandomChipColor } from "../utils/randomChipColor";
import { dummyLawyers } from "../dummyData/allLawyers";
import "../assets/styles/MeetingDetails.css";

export default {
  name: "MeetingDetails",
  components: { DatePicker },
  data() {
    return {
      meetTitle: "",
      selectedClient: "",
      selectedLawyer: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      paymentStatus: "",
      amount: "",
      errors: {},
      lawyerList: dummyLawyers,
      blockedDates: ["2026-01-20", "2026-01-22", "2026-01-25"],
      attendeeList: [
        "Devjyoti Mukherjee",
        "Mahesh Chhetri",
        "Souvik Sarkar",
        "Pallab Adhikary",
        "Mainak Bhattacharya",
      ],
      attendeeColors: [],
    };
  },
  computed: {
    meetingId() {
      if (this.$route.path.includes("general-meeting")) return 3;
      if (this.$route.path.includes("client-meeting")) return 2;
      if (this.$route.path.includes("client-consultation")) return 1;
      return null;
    },
    currentMeeting() {
      return (
        meetingTypes.find((m) => m.id === this.meetingId) || meetingTypes[0]
      );
    },
    isClientMeeting() {
      return this.meetingId === 2;
    },
    isGeneralMeeting() {
      return this.meetingId === 3;
    },
  },
  created() {
    this.attendeeColors = this.attendeeList.map(() => getRandomChipColor());
  },
  methods: {
    disableBlockedDates(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.blockedDates.includes(formatted) || date < today;
    },
    validateForm() {
      const errors = {};
      if (this.isClientMeeting || this.isGeneralMeeting) {
        if (!this.meetTitle) errors.meetTitle = "Title is required";
      }
      if (!this.selectedClient) errors.selectedClient = "Client is required";
      if (!this.selectedLawyer) errors.selectedLawyer = "Lawyer is required";
      if (!this.appointmentDate) errors.appointmentDate = "Date required";
      if (!this.startTime) errors.startTime = "Start time required";
      if (!this.endTime) errors.endTime = "End time required";
      if (!this.amount) errors.amount = "Amount is required";
      if (!this.paymentStatus) errors.paymentStatus = "Select payment status";

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    goNext() {
      if (!this.validateForm()) return;
      this.$router.push({
        path: "/schedule-meeting/client-consultation/mode",
        query: {
          client: this.selectedClient,
          lawyer: this.selectedLawyer,
          title: this.meetTitle,
          date: this.appointmentDate,
          start: this.startTime,
          end: this.endTime,
          amount: this.amount,
          status: this.paymentStatus,
          attendeeList: this.attendeeList,
        },
      });
    },
  },
};
</script>

<style scoped>
/* CALENDAR SIDEBAR */
.calendar-sidebar {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 32px;
}

/* --- DATEPICKER RED ROUNDED STYLING --- */

::v-deep .mx-datepicker-inline {
  width: 100% !important;
}

/* This targets the selected/active date */
::v-deep .mx-calendar-content .cell.actived {
  background-color: #a5e83f !important;
  color: green !important;
  border-radius: 50% !important;
}

/* Hover state for cells */
::v-deep .mx-calendar-content .cell:hover {
  color: green !important;
  background-color: #a5e83f !important;
  border-radius: 50% !important;
}

::v-deep .mx-calendar-content .cell.disabled {
  background-color: #fee2e2 !important;
  color: #ef4444 !important;
  border-radius: 50% !important;
  cursor: not-allowed !important;
}
::v-deep .mx-calendar-content .cell {
  color: #000000 !important;
  font-weight: 500;
  border-radius: 50% !important;
}

/* --- DATEPICKER HEADER & DAYS STYLING --- */

/* 1. Month and Year (e.g., Jan 2026) */
::v-deep .mx-calendar-header-label {
  color: #000000 !important;
  font-weight: 800 !important;
  font-size: 16px !important;
  border-radius: 50% !important;
}

::v-deep .mx-btn-icon-double-left,
::v-deep .mx-btn-icon-double-right,
::v-deep .mx-btn-icon-left,
::v-deep .mx-btn-icon-right {
  color: #000000 !important;
}

::v-deep .mx-calendar-content th {
  color: #000000 !important;
  font-weight: 700 !important;
  padding-bottom: 4px;
}

/* Today's date circle */
::v-deep .mx-calendar-content .cell.today {
  color: green !important;
  font-weight: bold;
  border-radius: 50% !important;
  font-size: 16px;
}

/* --- END DATEPICKER STYLING --- */
</style>
